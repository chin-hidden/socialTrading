import typing
import requests
from enum import Enum



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



class VndirectOrsClient:
    ORS_HOST = "http://10.26.1.112:8088/"
    # This class is mostly a reverse engineering effort from the official Java ORS client.
    # https://ivnd.vndirect.com.vn/pages/viewpage.action?pageId=160202776

    def __init__(self, host):
        self.ors_host = host
        self.client_id = 0

    def place_order(self,
                    account: str,
                    side: OrderSide,
                    order_type: OrderType,
                    symbol: str,
                    price: float,
                    quantity: int) -> dict:
        """\
        Place an order using VNDirect's ORS subsystem.
        """
        params = {
            "msgType": "D",
            "clOrdId": self._generate_client_id(),
            "account": account,
            "side": side,
            "ordType": order_type.numeric_order_type,
            "timeInForce": order_type.time_in_force,
            "symbol": symbol,
            "price": price,
            "quantity": quantity,
        }
        res = requests.get(self.ors_host + "/order/executePlaceOrder", params=params)
        return res.json()

    def _generate_client_id(self):
        self.client_id += 1
        return self.client_id

    def _generate_fix_side(side):
        # Java code:
        # return (char)(!side.equals("NS") && !side.equals("MS")?(side.equals("NB")?'1':'0'):'2')
        if side == "NB":
            return '0'
        elif side == "NS" or side == "MS":
            return '1'
        else:
            return '2'


class JsonWrapper:
    @classmethod
    def from_json(cls, json_blob: dict):
        obj = cls()
        obj._json = json_blob
        return obj


class Account(JsonWrapper):
    @property
    def account_number(self) -> str:
        return self._json['accountNumber']

    @property
    def full_name(self) -> str:
        return self._json['fullName']


class UserDetail(JsonWrapper):
    @property
    def customer_id(self) -> str:
        return self._json['customerId']

    @property
    def customer_name(self) -> str:
        return self._json['customerName']

    @property
    def accounts(self) -> typing.List[Account]:
        return [Account.from_json(account_json) for account_json in self._json['accounts']]


class Stock(JsonWrapper):
    @property
    def cost(self) -> float:
        return self._json['cost']

    @property
    def cost_price(self) -> float:
        return self._json['costPrice']

    @property
    def current_price(self) -> float:
        return self._json['currentPrice']

    @property
    def profit(self) -> float:
        return self._json['gainLoss']

    @property
    def roi(self) -> float:
        return self._json['gainLossRatio']

    @property
    def quantity(self) -> int:
        return self._json['quantity']

    @property
    def stock_symbol(self) -> str:
        return self._json['symbol']


class Portfolio(JsonWrapper):
    @property
    def total_cost(self) -> float:
        return self._json['totalCost']

    @property
    def ratio(self) -> float:
        return self._json['ratio']

    @property
    def profit(self) -> float:
        return self._json['profit']

    @property
    def total_current_value(self) -> float:
        return self._json['totalCurrentValue']

    @property
    def stocks(self) -> typing.List[Stock]:
        return [Stock.from_json(stock_json) for stock_json in self._json['stocks']]


class AccountDetail(JsonWrapper):
    @property
    def account_number(self) -> str:
        return self._json['accountNumber']

    @property
    def cash(self) -> float:
        return self._json['cash']

    @property
    def purchase_power(self) -> float:
        return self._json['purchasePower']

    @property
    def nav(self) -> float:
        return self._json['NAV']

    @property
    def withdrawable(self) -> float:
        return self._json['withdrawable']

    @property
    def portfolio(self) -> Portfolio:
        return Portfolio.from_json(self._json['portfolio'])



class VndirectTradeApiClient:
    """\
    Client to communicate with VNDIRECT's TradeAPI.  Offial documentation at:
    https://ivnd.vndirect.com.vn/pages/viewpage.action?pageId=200605724
    """

    # FIXME: Refactor to use requests.Session() so that we don't have
    #        to litter `headers=headers` everyf*ckingwhere.

    AUTH_URL = "https://api.vndirect.com.vn/auth"
    API_URL = "https://api.vndirect.com.vn/trade"

    def login(self, username: str, password: str) -> str:
        """\
        Log the user in.

        Returns:
            str: The first authentication token.
        """
        res = requests.post(self.AUTH_URL + "/auth",
            json={"username": username, "password": password})
        res.raise_for_status()

        self.token = res.json()["token"]
        return self.token

    def get_vtos(self) -> typing.List[str]:
        """
        Get the VTOS challenges.

        Returns:
            list: E.g. ["E1", "G1", "H3"]
        """
        headers = {"X-AUTH-TOKEN": self.token}
        return requests.get(self.AUTH_URL + "/vtos",
                            headers=headers).json()['challenges']

    def login_vtos(self, v1: str, v2: str, v3: str):
        """
        Second phase login.

        Returns:
            str: The second phase token.
        """
        headers = {"X-AUTH-TOKEN": self.token}
        payload = {
            "codes": ", ".join((v1, v2, v3))
        }

        res = requests.post(self.AUTH_URL + '/vtos/auth',
                            headers=headers,
                            json=payload)

        self.token = res.json()['token']
        return self.token

    def get_user_detail(self) -> UserDetail:
        """\
        Get the basic details of the authenticated user.
        """
        headers = {"X-AUTH-TOKEN": self.token}

        res = requests.get(self.API_URL + "/customer", headers=headers)
        return UserDetail.from_json(res.json())

    def get_account_detail(self, account_nr: str) -> AccountDetail:
        """\
        Get the details of an account. It is the consolidation of the following API endpoints:

        - GET /accounts, then extract out the relevant account
        - GET /accounts/<account_nr>/portfolio
        """
        headers = {"X-AUTH-TOKEN": self.token}

        res = requests.get(self.API_URL + "/accounts",
            headers=headers)
        accounts = res.json()["accounts"]

        account = {}
        for acc in accounts:
            if acc["accountNumber"] == account_nr:
                account = acc
                break

        url = self.API_URL + "/accounts/" + account_nr + "/portfolio"
        res = requests.get(url, headers=headers)
        account['portfolio'] = res.json()

        return AccountDetail.from_json(account)
