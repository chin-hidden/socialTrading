from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


Base = declarative_base()


class User:
    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.id


class UserDao:
    def get_user_by_username(self, username):
        if username == "ndtrung4419":
            user = User()
            user.id = username
            user.name = "Trung Ngo"
            user.type = "FOLLOWER"
            user.accountNumber = "1234"
            user.cash = 4566754
            user.broker = "VND"
            user.riskFactor = 60
            user.firstLogin = False
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

engine = create_engine("postgresql://localhost/duber", echo=True)
Session = sessionmaker(bind=engine)
session = Session()
