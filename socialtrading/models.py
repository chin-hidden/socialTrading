# coding: utf8

from enum import Enum
from socialtrading import db
from .utils import JsonWrapper


class OrderType(Enum):
    ATO = ("ATO", 1, 2)
    LO  = ("LO",  2, 0)
    ATC = ("ATC", 1, 7)
    MP  = ("MP",  1, 0)
    MOK = ("MOK", 1, 4)
    MAK = ("MAK", 1, 3)
    MTL = ("MTL", 1, 0)

    @property
    def numeric_order_type(self) -> int:
        return self.value[1]

    @property
    def time_in_force(self) -> int:
        return self.value[2]


class OrderSide(Enum):
    NORMAL_SELL = "NS"
    NORMAL_BUY = "NB"
    MARGIN_SELL = "MS"

    @classmethod
    def from_int(cls, code):
        return {
            1: OrderSide.NORMAL_BUY,
            2: OrderSide.NORMAL_SELL,
            5: OrderSide.MARGIN_SELL
        }[code]


class Exchange(Enum):
    HOSE = 0
    HNX = 1
    UPCOM = 2


class StockInfo(JsonWrapper):
    @property
    def symbol(self) -> str:
        return self._json['symbol']

    @property
    def exchange(self) -> Exchange:
        return self._json['exchange']

    @property
    def risk(self) -> int:
        return self._json['risk']

    @property
    def name(self) -> str:
        return self._json['name']


class StockService:
    def get_stock_detail_by_symbol(self, symbol: str) -> StockInfo:
        """\
        Look up a stock detail by its symbol.
        """

        stocks = [{'symbol': 'FPT', 'risk': 30, 'name': 'Tập đoàn FPT', 'exchange': 10},
        {'symbol': 'AAA', 'risk': 60, 'name': 'Công ty nhựa An Phát', 'exchange': 2},
        {'symbol': 'KLS', 'risk': 34, 'name': 'Chứng khoán Kim Long', 'exchange': 2},
        {'symbol': 'MSN', 'risk': 15, 'name': 'Tập đoàn Masan', 'exchange': 10},
        {'symbol': 'REE', 'risk': 35, 'name': 'CTCP cơ điện lạnh', 'exchange': 10},
        {'symbol': 'SAM', 'risk': 35, 'name': 'CTCP Cáp Savico', 'exchange': 10},
        {'symbol': 'VIC', 'risk': 20, 'name': 'Tập đoàn Vin Group', 'exchange': 10},
        {'symbol': 'VNM', 'risk': 20, 'name': 'Sữa Vinamilk', 'exchange': 10},
        {'symbol': 'VND', 'risk': 30, 'name': 'Chứng khoán Vndirect', 'exchange': 2},
        {'symbol': 'ACB', 'risk': 28, 'name': 'Ngân hàng Á Châu', 'exchange': 2},
        {'symbol': 'SSI', 'risk': 20, 'name': 'Chứng khoán SSI', 'exchange': 10},
        {'symbol': 'SHS', 'risk': 50, 'name': 'CT chứng khoán SHB', 'exchange': 2},
        {'symbol': 'SHB', 'risk': 40, 'name': 'Ngân hàng SHB', 'exchange': 2},
        {'symbol': 'POT', 'risk': 30, 'name': 'CTCP thiết bị bưu điện', 'exchange': 2},
        {'symbol': 'HQC', 'risk': 20, 'name': 'Địa ốc Hoàng Quân', 'exchange': 10},
        {'symbol': 'VHG', 'risk': 20, 'name': 'Cao su Quảng Nam', 'exchange': 10},
        {'symbol': 'PSD', 'risk': 30, 'name': 'CT dịch vụ dầu khí', 'exchange': 2},
        {'symbol': 'PMC', 'risk': 30, 'name': 'Dược phẩm Pharmedic', 'exchange': 2}]

        for stock in stocks:
            if stock['symbol'] == symbol:
                return StockInfo.from_json(stock)


class Following(db.Model):
    __tablename__ = "following"

    trader_id = db.Column(db.String, db.ForeignKey('account.username'),
        name='trader', primary_key=True)
    follower_id = db.Column(db.String, db.ForeignKey('account.username'),
        name='follower', primary_key=True)
    allocated_money = db.Column(db.Float)
    trader = db.relationship("Account", backref="follower_assocs",
        foreign_keys=[trader_id])

    @property
    def profit(self) -> float:
        deals = Deal.query \
            .join(Transaction, Transaction.order_id == Deal.buying_order_id) \
            .filter(Transaction.username == self.follower_id) \
            .filter(Transaction.mimicking_username == self.trader_id).all()

        return sum(map(lambda deal: deal.profit, deals))

    @property
    def roi(self):
        # The sum of the volume of the buying transactions made by this
        # relationship that are part of a deal that is "done".
        _investment = db.session \
            .query(db.func.sum(Transaction.matched_price * Transaction.matched_quantity)) \
            .join(Deal, Transaction.order_id == Deal.buying_order_id) \
            .filter((Transaction.username == self.follower_id) & (Transaction.mimicking_username == self.trader_id)
                & (Transaction.side == "NB")
                & (Deal.selling_order_id.isnot(None))) \
            .scalar()
        investment = float(_investment)

        return self.profit / investment


class Account(db.Model):
    __tablename__ = "account"

    account_number = db.Column(db.String)
    username = db.Column(db.String, primary_key=True)
    password = db.Column(db.String)
    name = db.Column(db.String)
    broker = db.Column(db.String)
    cash = db.Column(db.Float)
    account_type = db.Column(db.String)
    initialized = db.Column(db.Boolean, default=False)

    trader_assocs = db.relationship("Following",
        backref="follower",
        foreign_keys=[Following.follower_id])

    __mapper_args__ = {
        'polymorphic_on': account_type
    }

    def __repr__(self):
        return "<{account_type} username={username}>".format(**self.__dict__)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    @property
    def id(self):
        return self.username

    def get_id(self):
        return self.username

    @property
    def nav(self):
        return self.cash + self.gross_stock_value

    @property
    def gross_stock_value(self):
        deals = deal_service.get_active_deals_by_username(self.username)
        return sum(map(lambda d: d.quantity * d.buying_price, deals))

    @property
    def gross_profit(self):
        return 500

    @property
    def is_demo_account(self):
        return self.broker == "__DEMO__"


class Follower(Account):
    __tablename__ = "followerinfo"
    username = db.Column(db.String, db.ForeignKey('account.username'), primary_key=True)
    risk_factor = db.Column(db.Integer, default=50)

    __mapper_args__ = {
        'polymorphic_identity': 'FOLLOWER',
    }

    def next_money_slot(self):
        SLOT_SIZE = 10000000  # 10 million VND
        quo, rem = divmod(self.cash, SLOT_SIZE)
        if quo == 0:
            return rem
        else:
            return SLOT_SIZE



class Trader(Account):
    __tablename__ = "traderinfo"
    username = db.Column(db.String, db.ForeignKey('account.username'), primary_key=True)
    description = db.Column(db.String)

    @property
    def total_allocated_money(self):
        # FIXME: Slow query
        return sum(map(lambda f: f.allocated_money, self.follower_assocs))

    @property
    def people_following(self):
        # FIXME: Slow query
        return len(self.follower_assocs)

    @property
    def roi(self):
        return 10

    __mapper_args__ = {
        'polymorphic_identity': 'TRADER',
    }


class Transaction(db.Model):
    __tablename__ = "transaction"
    order_id = db.Column(db.String, primary_key=True)
    username = db.Column(db.String, db.ForeignKey('account.username'))
    mimicking_username = db.Column(db.String, db.ForeignKey('account.username'))
    symbol = db.Column(db.String)
    quantity = db.Column(db.Integer)
    price = db.Column(db.Float)
    date = db.Column(db.DateTime)
    side = db.Column(db.Enum("NS", "NB", "MS"))
    type = db.Column(db.Enum("LO"))
    matched_price = db.Column(db.Float, default=0)
    matched_quantity = db.Column(db.Integer, default=0)
    status = db.Column(db.String, default="PendingNew")

    @property
    def volume(self):
        return self.price * self.quantity

    @property
    def matched_volume(self):
        return self.matched_price * self.matched_quantity


class Deal(db.Model):
    __tablename__ = "deal"

    id = db.Column(db.Integer, primary_key=True)
    buying_order_id = db.Column(db.String, db.ForeignKey('transaction.order_id'))
    selling_order_id = db.Column(db.String, db.ForeignKey('transaction.order_id'))

    buying_transaction = db.relationship("Transaction", foreign_keys=[buying_order_id])
    selling_transaction = db.relationship("Transaction", foreign_keys=[selling_order_id])

    @property
    def username(self):
        return self.buying_transaction.username

    @property
    def mimicking_username(self):
        return self.buying_transaction.mimicking_username

    @property
    def buying_price(self):
        return self.buying_transaction.matched_price or 0

    @property
    def selling_price(self):
        if self.selling_transaction:
            return self.selling_transaction.matched_price
        else:
            return 0

    @property
    def quantity(self):
        return self.buying_transaction.matched_quantity or self.buying_transaction.quantity

    @property
    def status(self):
        side = "SELLING" if self.selling_transaction else "BUYING"
        return side + ":" + self.buying_transaction.status

    @property
    def active(self):
        return not self.status == "SELLING:Filled"

    @property
    def symbol(self):
        return self.buying_transaction.symbol

    @property
    def buying_date(self):
        return self.buying_transaction.date

    @property
    def profit(self):
        return self.selling_transaction.volume - self.buying_transaction.volume if self.status == "SELLING:Filled" else 0

    @property
    def roi(self):
        return self.profit / self.buying_transaction.volume if self.status == "SELLING:Filled" else 0


class UserService:
    def get_user_by_username(self, username: str) -> Account:
        return Account.query.get(username)

    def get_user_by_account_number(self,
                                   account_number: str,
                                   broker: str) -> Account:
        return Account.query.filter(Account.account_number == account_number,
                                    Account.broker == broker).first()

    def save_user(self, user: Account):
        db.session.add(user)
        db.session.commit()


class DealService:
    def get_deals_by_username(self, username):
        return Deal.query \
            .join(Transaction, Transaction.order_id == Deal.buying_order_id) \
            .filter(Transaction.username == username) \
            .all()

    def get_active_deals_by_username(self, username):
        return [deal for deal in self.get_deals_by_username(username) if deal.active]

    def get_deals_by_username_and_symbol(self, username, symbol):
        return Deal.query \
            .join(Transaction, Transaction.order_id == Deal.buying_order_id) \
            .filter(Transaction.username == username) \
            .filter(Transaction.symbol == symbol) \
            .all()

    def get_active_deals_by_username_and_symbol(self, username, symbol):
        return [deal for deal in self.get_deals_by_username_and_symbol(username, symbol) if deal.active]

    def get_deal_by_order_id(self, order_id):
        return Deal.query \
            .join(Transaction, Transaction.order_id == Deal.buying_order_id) \
            .filter(Transaction.order_id == order_id) \
            .first()


user_service = UserService()
stock_service = StockService()
deal_service = DealService()
