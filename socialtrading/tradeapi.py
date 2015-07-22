import requests


class VndirectTradeApiClient:
    API_URL = "https://api.vndirect.com.vn/v1"

    def login(self, username, password):
        """\
        Log the user in and return the 1st phase token.
        """
        res = requests.post(self.API_URL + "/auth",
            data={"username": username, "password": password})
        res.raise_for_status()

        token = res.json()["token"]
        return token

    def get_user_detail(self, token):
        """\
        - GET /customer
        """
        headers = {"Authorization": "Bearer " + token}

        res = requests.get(self.API_URL + "/customer", headers=headers)
        user = res.json()
        return user

    def get_account_detail(self, token, account_nr):
        """\
        - GET /accounts/{id}, and
        - GET /accounts/{id}/portfolio
        """
        headers = {"Authorization": "Bearer " + token}

        res = requests.get(self.API_URL + "/accounts/" + account_nr,
            headers=headers)
        account = res.json()

        url = self.API_URL + "/accounts/" + account_nr + "/portfolio"
        res = requests.get(url, headers=headers)
        account.update(res.json())

        return account
