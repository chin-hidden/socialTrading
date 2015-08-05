import pytest

from socialtrading import cloner
from socialtrading import models as m


@pytest.fixture
def trader(follower):
    t = m.Trader()
    t.username = "trungngo"
    t.account_number = "1234"

    # This trader has one follower
    f = m.Following()
    f.follower = follower
    t.follower_assocs = [f]
    return t


@pytest.fixture
def follower():
    f = m.Follower()
    f.username = "thachvu"
    f.account_number = "5678"
    f.cash = 1000000
    return f



def test_no_money(mocker, trader, follower):
    """Should not clone if a follower doesn't have enough money left to buy at least 1 unit of the stock in question."""
    follower.cash = 13399  # one unit smaller than 13400

    src_order = {
        "orderId": "0068060415001087",
        "account": trader.account_number,
        "transactTime": 1428285620000,
        "side": "2",
        "symbol": "DCM",
        "tradeDate": "20150406-09:00:20",
        "type": "2",
        "qty": 100,
        "price": 13400,
        "eventName": "SENT"
    }

    cloned_orders = cloner.clone_trader_order(trader, src_order)
    assert isinstance(cloned_orders, list)
    for c in cloned_orders:
        assert c['account'] != follower.account_number


def test_clone_one_order(mocker, trader, follower):
    """If all conditions suffice, clone the order with the value of one money slot."""
    follower.cash = 13400 * 2

    src_order = {
        "orderId": "0068060415001087",
        "account": trader.account_number,
        "transactTime": 1428285620000,
        "side": "2",
        "symbol": "DCM",
        "tradeDate": "20150406-09:00:20",
        "type": "2",
        "qty": 100,
        "price": 13400,
        "eventName": "SENT"
    }

    cloned_orders = cloner.clone_trader_order(trader, src_order)
    assert isinstance(cloned_orders, list)
    assert len(cloned_orders) == 1

    c = cloned_orders[0]
    assert c['account'] == follower.account_number
    assert c['qty'] == 2
    assert c['price'] == src_order['price']
