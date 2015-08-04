# Coding: utf8

import copy

from . import models as m


"""\
Code pertaining to the order cloning process.
"""


def clone_trader_order(order):
    """\
    Clone a trader's order for each of their followers.

    Args:
        order: a dict with the following format
            "_source": {
               "@class": "vn.com.vndirect.noticenter.model.response.SentOrderResponse",
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
    trader = m.UserDao.get_user_by_account_number(order['account'], 'VNDIRECT')

    if not trader or not isinstance(trader, m.Trader):
        return []

    cloned_orders = []
    for follower_assoc in trader.follower_assocs:
        follower = follower_assoc.follower
        if follower.next_money_slot() < order['price']:
            continue

        cloned = copy.copy(order)
        cloned['account'] = follower.account_number
        cloned['qty'] = follower.next_money_slot() // cloned['price']
        cloned_orders.append(cloned)

    return cloned_orders
