import requests


class VndirectTradeApiClient:
    """\
    Client to communicate with VNDIRECT's TradeAPI.  Offial documentation at:
    https://ivnd.vndirect.com.vn/pages/viewpage.action?pageId=200605724
    """


    AUTH_URL = "https://api.vndirect.com.vn/auth"
    API_URL = "https://api.vndirect.com.vn/trade"

    def login(self, username, password):
        """\
        Log the user in.

        Returns:
            str: The authentication token.
        """
        res = requests.post(self.AUTH_URL + "/auth",
            data={"username": username, "password": password})
        res.raise_for_status()

        self.token = res.json()["token"]
        return self.token

    def get_user_detail(self):
        """\
        Get the basic details of the authenticated user.

        Returns:
            dict: of the following format

            {
              "customerId": "0001728170",
              "customerName": "ABC",
              "accounts": [
                {
                  "accountNumber": "0001019651",
                  "fullName": "ABC"
                },
                {
                  "accountNumber": "0001032423",
                  "fullName": "ABC, jr."
                }
              ]
            }
        """
        headers = {"X-AUTH-TOKEN": self.token}

        res = requests.get(self.API_URL + "/customer", headers=headers)
        user = res.json()
        return user

    def get_account_detail(self, account_nr):
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

        return account
