"""
Encoding the constraints of the 3 trading floors: HNX, HOSE and UPCOM.
"""

import math
import requests
from collections import namedtuple

PRICESERVICE_URL = "https://priceservice.vndirect.com.vn/priceservice"

Stock = namedtuple('Stock', ['symbol', 'company_name', 'floor_code'])
stocks = []


def parse_stock_info(line):
    arr = line.split("|")
    return Stock(
        symbol=arr[3],
        company_name=arr[4],
        floor_code=arr[0])

    # stockInfo.floorCode = arr[0]
    # stockInfo.tradingDate = arr[1]
    # stockInfo.time = arr[2]
    # stockInfo.code = arr[3]
    # stockInfo.companyName = arr[4]
    # stockInfo.stockType = arr[5]
    # stockInfo.totalRoom = arr[6]
    # stockInfo.currentRoom = arr[7]
    # stockInfo.basicPrice = arr[8]
    # stockInfo.openPrice = arr[9]
    # stockInfo.closePrice = arr[10]
    # stockInfo.currentPrice = arr[11]
    # stockInfo.currentQtty = arr[12]
    # stockInfo.highestPrice = arr[13]
    # stockInfo.lowestPrice = arr[14]
    # stockInfo.ceilingPrice = arr[15]
    # stockInfo.floorPrice = arr[16]
    # stockInfo.totalOfferQtty = arr[17]
    # stockInfo.totalBidQtty = arr[18]
    # stockInfo.matchPrice = arr[19]
    # stockInfo.matchQtty = arr[20]
    # stockInfo.matchValue = arr[21]
    # stockInfo.averagePrice = arr[22]
    # stockInfo.bidPrice01 = arr[23]
    # stockInfo.bidQtty01 = arr[24]
    # stockInfo.bidPrice02 = arr[25]
    # stockInfo.bidQtty02 = arr[26]
    # stockInfo.bidPrice03 = arr[27]
    # stockInfo.bidQtty03 = arr[28]
    # stockInfo.offerPrice01 = arr[29]
    # stockInfo.offerQtty01 = arr[30]
    # stockInfo.offerPrice02 = arr[31]
    # stockInfo.offerQtty02 = arr[32]
    # stockInfo.offerPrice03 = arr[33]
    # stockInfo.offerQtty03 = arr[34]
    # stockInfo.accumulatedVal = arr[35]
    # stockInfo.accumulatedVol = arr[36]
    # stockInfo.buyForeignQtty = arr[37]
    # stockInfo.sellForeignQtty = arr[38]
    # stockInfo.projectOpen = arr[39]
    # stockInfo.sequence = arr[40]


def query_stock_info(stock_symbol):
    res = requests.get(PRICESERVICE_URL + "/secinfo/snapshot/q=codes:" + stock_symbol)
    return parse_stock_info(res.json()[0])


def get_stock_from_symbol(symbol: str):
    for stock in stocks:
        if stock.symbol == symbol:
            return stock

    # If it's not there yet then ask from the priceservice
    stock = query_stock_info(symbol)
    stocks.append(stock)
    return stock


def get_floor_from_stock(stock: Stock):
    return get_floor_from_floor_code(stock.floor_code)


def get_floor_from_floor_code(code: str):
    mapping = {
        '02': HnxFloor(),
        '10': HoseFloor(),
        '03': UpcomFloor()
    }

    if code in mapping:
        return mapping[code]


class Floor:
    def price_step(price): pass

    def volume_step(volume): pass

    def round_price(self, price):
        return round(price * self.price_step(price)) / self.price_step(price)

    def round_volume(self, volume):
        return math.floor(volume / self.volume_step(volume)) * self.volume_step(volume)


class HnxFloor(Floor):
    def price_step(self, price):
        return 100

    def volume_step(self, volume):
        return 100


class HoseFloor(Floor):
    def price_step(self, price):
        if price < 50000:
            step = 100.0
        elif price < 100000:
            step = 500.0
        else:
            step = 1000.0
        return step

    def volume_step(self, volume):
        return 10


# We don't really care about UPCOM right now.
class UpcomFloor(Floor):
    pass


# Prequery all stock info
def prefetch_stock_info():
    res = requests.get(PRICESERVICE_URL + "/company/snapshot/")

    companies = res.json()
    for company in companies:
        stocks.append(Stock(
            symbol=company["code"],
            company_name=company["companyName"],
            floor_code=company["floorCode"]))
