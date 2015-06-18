import sqlengine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()
Session = sessionmaker(bind=engine)


class Account(Base):
    __tablename__ = 'account'

    account_name = Column(String, primary_key=True)
    name = Column(String)
    username = Column(String)
    password = Column(String)


engine = sqlengine.create_engine('postgresql')
Session.configure(bind=engine)