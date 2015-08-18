# Coding: utf8

"""\
Code pertaining to the order cloning process.

For more details about data types, refer to: https://ivnd.vndirect.com.vn/display/RD/NotiCenter
"""

import kombu
import kombu.mixins
import logging
import time
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
    blob['transactTime'] = datetime.datetime.fromtimestamp(blob['transactTime'] / 1000)
    blob['side'] = OrderSide.from_int(blob['side'])
    return ExecutedOrderResponse(**blob)


Order = typing.NamedTuple('Order',
    [('account_number', str),
     ('price', float),
     ('stock_symbol', str),
     ('quantity', int),
     ('side', OrderSide),
     ('type', OrderType)])


class OrderProcessor:
    def __init__(self,
                 message_router: notification.MessageRouter,
                 user_service: models.UserService):
        self.message_router = message_router
        self.user_service = user_service

    def process_trader_message(self, trader, message):
        trader_order = parse_executed_order_response(message)
        cloned_orders = self.clone_trader_order(trader, trader_order)

        for order in cloned_orders:
            # Find the corresponding session and place the order
            # using that session's trade api client.
            follower = self.user_service \
                .get_user_by_account_number(order.account_number, broker="VNDIRECT")

            if follower.is_demo_account:
                # Pretend that the order has been matched completely immediately.
                self.process_follower_message(follower, {
                    "lol": "lol"
                })

            # FIXME: Blocking operation. Should leverage some kind of
            # async capability.
            time.sleep(0.5)

            # After placing the order, open a transaction with that
            # order for further order notifications.

    def process_follower_message(self, follower, message):
        # FIXME: Is this an executed notification for an order we placed?


        # Notification
        self.message_router.send_message_to_user(
            follower.username,
            "order_executed",
            message)

    def clone_trader_order(self,
                           trader: models.Trader,
                           order: ExecutedOrderResponse) -> typing.List[Order]:
        """\
        Clone a trader's order for each of their followers.

        Returns:
            A list of similar orders.

        Refers: https://ivnd.vndirect.com.vn/display/RD/NotiCenter
        """
        # FIXME distinguish selling/buying orders

        cloned_orders = []
        for follower_assoc in trader.follower_assocs:
            follower = follower_assoc.follower
            if follower.next_money_slot() < order.price:
                logger.debug("Follower doesn't have enough money.")
                continue

            new_price = order.price
            cloned = Order(
                account_number=follower.account_number,
                price=new_price,
                stock_symbol=order.symbol,
                quantity=follower.next_money_slot() // new_price,
                side=order.side,
                type=OrderType.MP
            )

            cloned_orders.append(cloned)

        return cloned_orders


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
                if isinstance(user, models.Trader):
                    self.order_processor.process_trader_message(user, body)
                else:
                    self.order_processor.process_follower_message(user, body)

        except:
            logger.exception("Something wrong!")
        finally:
            message.ack()


order_processor = OrderProcessor(
    message_router=notification.message_router,
    user_service=models.user_service)



def run_order_processor():
    logger.info("starting listener")
    uri = socialtrading.app.config['NOTICENTER_CONNECTION']
    with kombu.Connection(uri) as conn:
        listener = OrderListener(conn, order_processor)
        listener.run()
