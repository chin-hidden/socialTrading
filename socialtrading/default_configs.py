# MUST be set to False for production.
DEBUG = True
ASSETS_DEBUG = True
DEBUG_TB_INTERCEPT_REDIRECTS = False

# CHANGE THIS!!!!
SECRET_KEY = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

SQLALCHEMY_DATABASE_URI = "postgresql://@/duber"

SERVER_HOST = "0.0.0.0"
SERVER_PORT = 5000

NOTICENTER_CONNECTION = 'amqp://guest:guest@localhost:5672/'
NOTICENTER_EXECUTED_EXCHANGE = "NotiCenter.Exchange.ExecutedOrder"

BROKERS = {
    'VNDIRECT': {
        "TRADEAPI_BASE": "https://trade-api.vndirect.com.vn",
        "AUTH_BASE": "https://auth-api.vndirect.com.vn",
        "ORS_BASE": "http://10.26.1.112:8088"
    }
}

PYSCSS_LOAD_PATHS = ["../jspm_packages/npm/bootstrap-sass@3.3.5/assets/stylesheets/"]
