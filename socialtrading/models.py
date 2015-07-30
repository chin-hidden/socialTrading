from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from flask import session


Base = declarative_base()


class UserDao:
    def sync_user_with_tradeapi(self, username, tradeapi_token):
        """\
        Query TradeAPI to sync the user's full name, cash.
        """

    def get_user_by_username(self, username):
        user = Account()
        user.username = username
        user.account_type = "FOLLOWER"
        user.account_number = "1234"
        user.broker = "VND"
        user.risk_factor = 60
        user.first_login = False

        # Synchronize user data with the TradeAPI.
        # FIXME: We are syncing for every request. VERY SLOW!!!
        if 'tradeapi-client' in session:
            client = session['tradeapi-client']
            user_detail = client.get_user_detail()
            user.name = user_detail['customerName']

            account_detail = client.get_account_detail(user_detail["accounts"][0]['accountNumber'])
            user.account_number = account_detail["accountNumber"]
            user.cash = account_detail["cash"]

        return user


class Following(Base):
    __tablename__ = "following"

    trader_id = Column(String, ForeignKey('account.username'),
        name='trader', primary_key=True)
    follower_id = Column(String, ForeignKey('account.username'),
        name='follower', primary_key=True)
    allocated_money = Column(Numeric, name='allocatedmoney')
    trader = relationship("Account", backref="follower_assocs",
        foreign_keys=[trader_id])


class Account(Base):
    __tablename__ = "account"

    account_number = Column(String, name="accountnumber")
    username = Column(String, primary_key=True)
    password = Column(String)
    name = Column(String)
    cash = Column(Numeric)
    account_type = Column(String, name="type")

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
        return {key: value for key, value in self.__dict__.items() if not key.startswith("_")}


class Follower(Account):
    __tablename__ = "followerinfo"
    username = Column(String, ForeignKey('account.username'), primary_key=True)
    risk_factor = Column(Integer, name="riskfactor")

    __mapper_args__ = {
        'polymorphic_identity': 'FOLLOWER',
    }


class Trader(Account):
    __tablename__ = "traderinfo"
    username = Column(String, ForeignKey('account.username'), primary_key=True)

    @property
    def total_allocated_money(self):
        # FIXME: Slow query
        return sum(map(lambda f: f.allocated_money, self.follower_assocs))

    @property
    def people_following(self):
        # FIXME: Slow query
        return len(self.follower_assocs)

    __mapper_args__ = {
        'polymorphic_identity': 'TRADER',
    }


# engine = create_engine("postgresql://localhost/duber", echo=True)
engine = create_engine("postgresql+pg8000://localhost/duber", echo=True)
Session = sessionmaker(bind=engine)
db_session = Session()
