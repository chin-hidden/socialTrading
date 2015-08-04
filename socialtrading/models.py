# coding: utf8

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, ForeignKeyConstraint, PrimaryKeyConstraint, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker



Base = declarative_base()



class Stock:
    @classmethod
    def get_stock_detail_by_symbol(cls, symbol):
        """\
        Look up a stock detail by its symbol.

        Args:
            symbol (str): the symbol name.

        Returns:
            dict or None if no such stock is found.
                {'symbol': 'AAA', 'risk': 60, 'name': 'Công ty nhựa An Phát', 'exchange': 02}
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
                return stock



class UserDao:
    def sync_user_with_tradeapi(self, username, tradeapi_token):
        """\
        Query TradeAPI to sync the user's full name, cash.
        """

    @classmethod
    def get_user_by_username(cls, username):
        user = db_session.query(Account).get(username)
        try:
            # Triggers SQLAlchemy to load this property
            # FIXME: Configure SQLAlchemy to always eagerly load risk_factor
            user.risk_factor
        except:
            pass

        # user = Account()
        # user.username = username
        # user.account_type = "FOLLOWER"
        # user.account_number = "1234"
        # user.brokerage = "VND"
        # user.risk_factor = 60
        # user.first_login = False

        # # Synchronize user data with the TradeAPI.
        # # FIXME: We are syncing on every request. VERY SLOW!!!
        # if 'tradeapi-client' in session:
        #     client = session['tradeapi-client']
        #     user_detail = client.get_user_detail()
        #     user.name = user_detail['customerName']

        #     account_detail = client.get_account_detail(user_detail["accounts"][0]['accountNumber'])
        #     user.account_number = account_detail["accountNumber"]
        #     user.cash = account_detail["cash"]

        return user


class Following(Base):
    __tablename__ = "following"

    trader_id = Column(String, ForeignKey('account.username'),
        name='trader', primary_key=True)
    follower_id = Column(String, ForeignKey('account.username'),
        name='follower', primary_key=True)
    allocated_money = Column(Numeric)
    trader = relationship("Account", backref="follower_assocs",
        foreign_keys=[trader_id])


class Account(Base):
    __tablename__ = "account"

    account_number = Column(String)
    username = Column(String, primary_key=True)
    password = Column(String)
    name = Column(String)
    brokerage = Column(String)
    cash = Column(Numeric)
    account_type = Column(String)

    trader_assocs = relationship("Following",
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

    def get_id(self):
        return self.username

    def as_dict(self):
        ignored_keys = ['password']
        return {key: value
            for key, value in self.__dict__.items()
            if not key.startswith("_") and key not in ignored_keys}


class Follower(Account):
    __tablename__ = "followerinfo"
    username = Column(String, ForeignKey('account.username'), primary_key=True)
    risk_factor = Column(Integer)

    __mapper_args__ = {
        'polymorphic_identity': 'FOLLOWER',
    }


class Trader(Account):
    __tablename__ = "traderinfo"
    username = Column(String, ForeignKey('account.username'), primary_key=True)
    description = Column(String)

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


class Position(Base):
    __tablename__ = "position"

    username = Column(String)
    mimicking_username = Column(String)
    symbol = Column(String)
    quantity = Column(String)
    buying_price = Column(Numeric)
    buying_date = Column(DateTime)  # FIXME: Check if we have timezone issue here.

    __table_args__ = (
        ForeignKeyConstraint(['username', 'mimicking_username'],
                             ['following.follower', 'following.trader']),
        PrimaryKeyConstraint('username', 'mimicking_username', 'symbol'),
    )


# engine = create_engine("postgresql://localhost/duber", echo=True)
engine = create_engine("postgresql+pg8000://localhost/duber", echo=True)
Session = sessionmaker(bind=engine)
db_session = Session()
