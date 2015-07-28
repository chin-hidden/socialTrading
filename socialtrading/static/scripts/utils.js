define(["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.formatCurrency = formatCurrency;
    exports.formatAmount = formatAmount;
    exports.formatPercent = formatPercent;
    exports.getMarketInfo = getMarketInfo;

    function formatCurrency(amount) {
        return amount.toLocaleString("vi", {
            style: "currency",
            currency: "VND"
        });
    }

    function formatAmount(amount) {
        return amount.toLocaleString("vi");
    }

    function formatPercent(amount) {
        return amount.toLocaleString("vi", { style: "percent" });
    }

    // Copied from Bang gia
    var MessageUnmashaller = {
        SEPARATOR: "|",
        map: {
            STOCK: function STOCK(b) {
                var a = b.split(MessageUnmashaller.SEPARATOR);
                if (a.length < 40) {
                    console.error("StockInfo message structre is change. ");
                }
                var itemInfo = {};
                itemInfo.floorCode = a[0];
                itemInfo.tradingDate = a[1];
                itemInfo.time = a[2];
                itemInfo.code = a[3];
                itemInfo.companyName = a[4];
                itemInfo.stockType = a[5];
                itemInfo.totalRoom = a[6];
                itemInfo.currentRoom = a[7];
                itemInfo.basicPrice = a[8];
                itemInfo.openPrice = a[9];
                itemInfo.closePrice = a[10];
                itemInfo.currentPrice = a[11];
                itemInfo.currentQtty = a[12];
                itemInfo.highestPrice = a[13];
                itemInfo.lowestPrice = a[14];
                itemInfo.ceilingPrice = a[15];
                itemInfo.floorPrice = a[16];
                itemInfo.totalOfferQtty = a[17];
                itemInfo.totalBidQtty = a[18];
                itemInfo.matchPrice = a[19];
                itemInfo.matchQtty = a[20];
                itemInfo.matchValue = a[21];
                itemInfo.averagePrice = a[22];
                itemInfo.bidPrice01 = a[23];
                itemInfo.bidQtty01 = a[24];
                itemInfo.bidPrice02 = a[25];
                itemInfo.bidQtty02 = a[26];
                itemInfo.bidPrice03 = a[27];
                itemInfo.bidQtty03 = a[28];
                itemInfo.offerPrice01 = a[29];
                itemInfo.offerQtty01 = a[30];
                itemInfo.offerPrice02 = a[31];
                itemInfo.offerQtty02 = a[32];
                itemInfo.offerPrice03 = a[33];
                itemInfo.offerQtty03 = a[34];
                itemInfo.accumulatedVal = a[35];
                itemInfo.accumulatedVol = a[36];
                itemInfo.buyForeignQtty = a[37];
                itemInfo.sellForeignQtty = a[38];
                itemInfo.projectOpen = a[39];
                itemInfo.sequence = a[40];
                return itemInfo;
            }
        },
        regist: function regist(b, a) {
            if (typeof a == "function") {
                this.map[b] = a;
            }
        },
        unmashall: function unmashall(a, b) {
            if (typeof this.map[a] == "undefined") {
                return b;
            }
            return this.map[a](b);
        }
    };

    /**
     * Query the VNDIRECT price service.
     */

    function getMarketInfo(symbol) {
        var url = "http://125.212.207.67/priceservice/secinfo/snapshot/q=codes:" + symbol;

        return new Promise(function (resolve, reject) {
            $.getJSON(url, function (data) {
                resolve(MessageUnmashaller.map.STOCK(data[0]));
            }, reject);
        });
    }
});
//# sourceMappingURL=utils.js.map