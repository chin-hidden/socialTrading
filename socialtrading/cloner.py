# Coding: utf8

"""\
Code pertaining to the order cloning process.
"""

import copy
import kombu
import kombu.mixins
import logging
import time

from . import models as m



logger = logging.getLogger(__name__)



def run_order_processor():
    logger.info("starting listener")
    with kombu.Connection('amqp://guest:guest@localhost:5672//') as conn:
        listener = OrderListener(conn)
        listener.run()



class OrderListener(kombu.mixins.ConsumerMixin):
    # FIXME This class is highly coupled with VNDIRECT's infrastructure.

    def __init__(self, connection):
        self.connection = connection

    def get_consumers(self, Consumer, channel):
        executed_exchange = kombu.Exchange('executed')
        executed_queue = kombu.Queue('executed', exchange=executed_exchange)

        return [Consumer(queues=[executed_queue],
                         accept=['json'],
                         callbacks=[self.process_task])]

    def process_task(self, body, message):
        try:
            user = m.UserDao.get_user_by_account_number(
                account_number=body['account'], broker='VNDIRECT')

            if user:
                if isinstance(user, m.Trader):
                    process_trader_message(user, body)
                else:
                    process_follower_message(user, body)

        except:
            logger.exception("Something wrong!")
        finally:
            message.ack()


def process_trader_message(trader, message):
    cloned_orders = clone_trader_order(trader, message)

    for order in cloned_orders:
        # Find the corresponding session and place the order
        # using that session's trade api client.
        print("cloned: ", order)

        # FIXME: Blocking operation. Should leverage some kind of async capability.
        time.sleep(1)

        # After placing the order, open a transaction with that
        # order for further order notifications.


def process_follower_message(follower, message):
    # Is this an executed notification for an order we placed?
    pass



def clone_trader_order(trader, order):
    """\
    Clone a trader's order for each of their followers.

    Args:
        order: a dict with the following fields
            {
               "orderId": "0068060415001087",
               "account": "000103232",
               "transactTime": 1428285620000,
               "side": "2",
               "symbol": "DCM",
               "tradeDate": "20150406-09:00:20",
               "type": "2",
               "qty": 100,
               "price": 13400,
               "eventName": "SENT"
            }

    Returns:
        A list of similar orders.
    """
    cloned_orders = []
    for follower_assoc in trader.follower_assocs:
        follower = follower_assoc.follower
        if follower.next_money_slot() < order['price']:
            logger.debug("Follower doesn't have enough money.")
            continue

        cloned = copy.copy(order)
        cloned['account'] = follower.account_number
        cloned['qty'] = follower.next_money_slot() // cloned['price']
        cloned_orders.append(cloned)

    return cloned_orders
