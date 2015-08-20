# Coding: utf8

"""\
Code pertaining to the order cloning process.

For more details about data types, refer to: https://ivnd.vndirect.com.vn/display/RD/NotiCenter
"""

import copy
import kombu
import kombu.mixins
import logging
import datetime
import typing

from . import models
import socialtrading
from .models import OrderSide, OrderType
from . import notification


logger = logging.getLogger(__name__)


ExecutedOrderResponse = typing.NamedTuple('ExecutedOrderResponse',
    [('orderId', str),
     ('account', str),
     ('transactTime', datetime.datetime),
     ('tradeDate', str),
     ('side', OrderSide),
     ('symbol', str),
     ('qty', int),
     ('price', float),
     ('matchedQty', int),
     ('matchedPrice', float)])


def parse_executed_order_response(blob: dict) -> ExecutedOrderResponse:
    blob = copy.copy(blob)
    blob['transactTime'] = datetime.datetime.fromtimestamp(blob['transactTime'] / 1000)
    blob['side'] = OrderSide.from_int(blob['side'])
    return ExecutedOrderResponse(**blob)


Order = typing.NamedTuple('Order',
    [('username', str),
     ('account_number', str),
     ('price', float),
     ('symbol', str),
     ('quantity', int),
     ('side', OrderSide),
     ('type', OrderType)])


class OrderProcessor:
    def __init__(self,
                 message_router: notification.MessageRouter,
                 user_service: models.UserService,
                 deal_service: models.DealService):
        self.message_router = message_router
        self.user_service = user_service
        self.deal_service = deal_service

    def on_trader_order_executed(self, trader: models.Trader, trader_order: ExecutedOrderResponse):
        for following_rel in trader.follower_assocs:
            follower = following_rel.follower

            # FIXME: this code is blocking so it would take a while to process
            # 1000 followers sequentially.
            if trader_order.side == OrderSide.NORMAL_BUY:
                self.follow_deal(follower, trader, trader_order)
            elif trader_order.side == OrderSide.NORMAL_SELL:
                self.sell_deal(follower, trader, trader_order)

    def follow_deal(self, follower, trader, trader_order):
        cloned_order = self.clone_buying_order(trader_order, follower)
        if cloned_order is None:
            return

        order_id = self.execute_order(follower, cloned_order)
        if order_id is None:
            return

        trans = models.Transaction()
        trans.order_id = order_id
        trans.username = follower.username
        trans.mimicking_username = trader.username
        trans.symbol = cloned_order.symbol
        trans.price = cloned_order.price
        trans.quantity = cloned_order.quantity
        trans.side = cloned_order.side.value
        trans.type = cloned_order.type.value[0]
        trans.date = datetime.datetime.now()

        deal = models.Deal()
        deal.buying_transaction = trans

        # FIXME: poor db interaction.
        models.db.session.add(trans)
        models.db.session.add(deal)
        models.db.session.add(follower)
        models.db.session.commit()

        self.message_router.send_message_to_user(
            follower.username,
            "deal:created",
            {"deal_id": deal.id})

        if follower.is_demo_account:
            # Pretend that the order has been matched completely immediately.
            self.on_follower_order_executed(follower, ExecutedOrderResponse(
                orderId=order_id,
                account=follower.account_number,
                transactTime=datetime.datetime.now(),
                tradeDate="haha",
                side=cloned_order.side,
                symbol=cloned_order.symbol,
                qty=cloned_order.quantity,
                price=cloned_order.price,
                matchedQty=cloned_order.quantity,
                matchedPrice=cloned_order.price,
            ))

    def sell_deal(self,
                  follower: models.Follower,
                  trader: models.Trader,
                  trader_order: ExecutedOrderResponse):
        deals_with_same_symbol = self.deal_service \
            .get_active_deals_by_username_and_symbol(
                follower.username, trader_order.symbol)

        deals_with_same_symbol = [deal for deal in deals_with_same_symbol if not deal.status.startswith("SELLING")]

        if deals_with_same_symbol:
            # Get the first deal with matching symbol
            # FIXME: Better logic to find a deal to sell.
            deal = deals_with_same_symbol[0]
            cloned_order = self.clone_selling_order(trader_order, follower, deal.buying_transaction)
            if cloned_order is None:
                return

            order_id = self.execute_order(follower, cloned_order)
            if order_id is None:
                return

            trans = models.Transaction()
            trans.order_id = order_id
            trans.username = follower.username
            trans.mimicking_username = trader.username
            trans.symbol = cloned_order.symbol
            trans.quantity = cloned_order.quantity
            trans.price = cloned_order.price
            trans.date = datetime.datetime.now()
            trans.side = cloned_order.side.value
            trans.type = cloned_order.type.value[0]

            deal.selling_transaction = trans

            # FIXME: poor db interaction.
            models.db.session.add(trans)
            models.db.session.add(deal)
            models.db.session.add(follower)
            models.db.session.commit()

            self.message_router.send_message_to_user(
                follower.username,
                "deal:updated",
                {"deal_id": deal.id})

            if follower.is_demo_account:
                # Pretend that the order has been matched completely immediately.
                self.on_follower_order_executed(follower, ExecutedOrderResponse(
                    orderId=order_id,
                    account=follower.account_number,
                    transactTime=datetime.datetime.now(),
                    tradeDate="haha",
                    side=cloned_order.side,
                    symbol=cloned_order.symbol,
                    qty=cloned_order.quantity,
                    price=cloned_order.price,
                    matchedQty=cloned_order.quantity,
                    matchedPrice=cloned_order.price,
                ))

    def execute_order(self, sender: models.Account, order: Order):
        if sender.broker == "__DEMO__":
            return datetime.datetime.now().__str__()

    def clone_buying_order(self,
                           trader_order: ExecutedOrderResponse,
                           follower: models.Follower):
        new_price = self.clone_price(follower, trader_order)

        # FIXME: Maybe we should loosen up a bit here?
        if follower.next_money_slot() < new_price:
            logger.debug("Follower doesn't have enough money.")
            return

        return Order(
            username=follower.username,
            account_number=follower.account_number,
            price=new_price,
            symbol=trader_order.symbol,
            quantity=follower.next_money_slot() // new_price,
            side=trader_order.side,
            type=OrderType.MP
        )

    def clone_selling_order(self,
                            trader_order: ExecutedOrderResponse,
                            follower: models.Follower,
                            buying_transaction: models.Transaction):
        new_price = self.clone_price(follower, trader_order)
        return Order(
            username=follower.username,
            account_number=follower.account_number,
            price=new_price,
            symbol=trader_order.symbol,
            quantity=buying_transaction.quantity,
            side=trader_order.side,
            type=OrderType.MP
        )

    def clone_price(self, follower: models.Follower, trader_order: ExecutedOrderResponse) -> float:
        # Buying price = Init_price*(1 + (risk-0.5)*40%)
        # Selling price = Init_print*(1-(risk-0.5)*40%)
        coef = 1 if trader_order.side == OrderSide.NORMAL_BUY else -1
        return trader_order.price * (1 + coef * (follower.risk_factor / 100 - 0.5) * 0.04)

    def on_follower_order_executed(self,
                                   follower: models.Follower,
                                   res: ExecutedOrderResponse):
        # Is this an executed notification for an order we placed?
        trans = models.Transaction.query.get(res.orderId)
        if trans is None:
            return

        # Recalculate the matched price and matched quantity
        old_volume = trans.matched_price * trans.matched_quantity
        matched_volume = res.matchedQty * res.matchedPrice
        new_quantity = trans.matched_quantity + res.matchedQty
        trans.matched_price = (matched_volume + old_volume) / new_quantity
        trans.matched_quantity += res.matchedQty

        if res.side == OrderSide.NORMAL_BUY:
            follower.cash -= matched_volume
        else:
            follower.cash += matched_volume

        trans.status = "Filled" if trans.quantity == trans.matched_quantity else "PartialFilled"

        models.db.session.add(trans)
        models.db.session.add(follower)
        models.db.session.commit()

        # Notification
        self.message_router.send_message_to_user(
            follower.username,
            "deal:updated",
            {})

        self.message_router.send_message_to_user(
            follower.username,
            "account:updated",
            {})


class OrderListener(kombu.mixins.ConsumerMixin):
    # FIXME This class is highly coupled with VNDIRECT's infrastructure.

    def __init__(self, connection, order_processor: OrderProcessor):
        self.connection = connection
        self.order_processor = order_processor

    def get_consumers(self, Consumer, channel):
        exch_name = socialtrading.app.config["NOTICENTER_EXECUTED_EXCHANGE"]
        executed_exchange = kombu.Exchange(exch_name,
                                           durable=False,
                                           type="fanout")
        executed_queue = kombu.Queue('SocialTrading.Queue.ExecutedOrder',
                                     exchange=executed_exchange,
                                     durable=False)

        return [Consumer(queues=[executed_queue],
                         accept=['json'],
                         callbacks=[self.process_task])]

    def process_task(self, body, message):
        try:
            user = models.user_service.get_user_by_account_number(
                account_number=body['account'], broker='VNDIRECT')

            if user:
                order_response = parse_executed_order_response(body)
                if isinstance(user, models.Trader):
                    self.order_processor.on_trader_order_executed(user, order_response)
                else:
                    self.order_processor.on_follower_order_executed(user, order_response)

        except:
            logger.exception("Something wrong!")
        finally:
            message.ack()


order_processor = OrderProcessor(
    message_router=notification.message_router,
    user_service=models.user_service,
    deal_service=models.deal_service)


def run_order_processor():
    logger.info("starting listener")
    uri = socialtrading.app.config['NOTICENTER_CONNECTION']
    with kombu.Connection(uri) as conn:
        listener = OrderListener(conn, order_processor)
        listener.run()
