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


@pytest.fixture
def user_service(mocker, trader, follower):
    service = m.UserService()

    def lookup_username(name):
        if name == "trungngo":
            return trader
        elif name == "thachvu":
            return follower

    service.get_user_by_username = mocker.MagicMock(side_effect=lookup_username)

    def lookup_account(acc, broker):
        if acc == "1234":
            return trader
        elif acc == "5678":
            return follower

    service.get_user_by_account_number = mocker.MagicMock(side_effect=lookup_account)
    return service


def test_no_money(mocker, trader, follower):
    """Should not clone if a follower doesn't have enough money left to buy at least 1 unit of the stock in question."""
    follower.cash = 13399  # one unit smaller than 13400
    order_processor = cloner.OrderProcessor(None, None)

    src_order = cloner.ExecutedOrderResponse(
        orderId="0068060415001087",
        account=trader.account_number,
        transactTime=1428285620000,
        tradeDate="20150406-09:00:20",
        side=2,
        symbol="DCM",
        qty=100,
        price=13400,
        matchedQty=100,
        matchedPrice=13400
    )

    cloned_orders = order_processor.clone_trader_order(trader, src_order)
    assert isinstance(cloned_orders, list)
    for c in cloned_orders:
        assert c.account_number != follower.account_number


def test_clone_one_order(mocker, trader, follower):
    """If all conditions suffice, clone the order with the value of one money slot."""
    follower.cash = 13400 * 2
    order_processor = cloner.OrderProcessor(None, None)

    src_order = cloner.ExecutedOrderResponse(
        orderId="0068060415001087",
        account=trader.account_number,
        transactTime=1428285620000,
        side=2,
        symbol="DCM",
        tradeDate="20150406-09:00:20",
        qty=100,
        price=13400,
        matchedQty=100,
        matchedPrice=13400)

    cloned_orders = order_processor.clone_trader_order(trader, src_order)
    assert isinstance(cloned_orders, list)
    assert len(cloned_orders) == 1

    c = cloned_orders[0]
    assert c.account_number == follower.account_number
    assert c.quantity == 2
    assert c.price == src_order.price


def test_frontend_notification(mocker, trader, follower, user_service):
    """\
    When a trader order is cloned, the frontend should be notified.
    """
    message_router = mocker.Mock()
    order_processor = cloner.OrderProcessor(message_router, user_service)
    follower.is_demo_account = True

    order_processor.process_trader_message(trader, {
        'orderId': "12312",
        'account': "13223",
        'transactTime': 1428282386000,
        'tradeDate': "20150406-08:06:26",
        'side': 1,
        'symbol': "VND",
        'qty': 100,
        'price': 121313,
        'matchedQty': 1312,
        'matchedPrice': 343432,
    })

    # message_router.send_message_to_user.assert_call_once_with()
    assert message_router.send_message_to_user.call_count == 1
