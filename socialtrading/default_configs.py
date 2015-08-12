# MUST be set to False for production.
DEBUG = True

# CHANGE THIS!!!!
SECRET_KEY = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

SQLALCHEMY_DATABASE_URI = "postgresql://@/duber"

SERVER_HOST = "0.0.0.0"
SERVER_PORT = 5000

NOTICENTER_CONNECTION = 'amqp://guest:guest@localhost:5672/'
NOTICENTER_EXECUTED_EXCHANGE = "NotiCenter.Exchange.ExecutedOrder"
