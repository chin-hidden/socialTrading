import Backbone from "backbone";
import DISPATCHER from "./dispatcher";
import SockJS from "sockjs-client";
import _ from "underscore";

//
// These models are the "stores" in Facebook's Flux architecture
// The properties of these models follow Python's snake_case convention.
//
function generateAvatar(username) {
    // return `https://sigil.cupcake.io/${username}?w=144`;
    // return `http://tinygraphs.com/isogrids/hexa16/${username}?theme=summerwarmth&numcolors=4&size=144&fmt=svg`;
    return `http://tinygraphs.com/labs/isogrids/hexa16/${username}?theme=summerwarmth&numcolors=4&size=220&fmt=svg`;
}

export var Traders = Backbone.Collection.extend({
    url: "/api/v1/traders",

    model: Backbone.Model.extend({
        getAvatar: function() {
            return generateAvatar(this.id);
        }
    }),

    comparator: function(item) {
        return item.get('id');
    },

    parse: function(data) {
        return data.result;
    }
});

export var FollowingRels = Backbone.Collection.extend({
    model: Backbone.Model.extend({
        initialize: function() {
            this.set("id", this.get("follower_id") + this.get("trader_id"));
        }
    }),

    initialize: function() {
        DISPATCHER.on("noti:deal:created noti:deal:updated", () => {
            this.fetch();
        });
    },

    parse: function(data) {
        return data.result;
    }
});


var Deals = Backbone.Collection.extend({
    parse: function(data) {
        return data.result;
    }
});

export var Follower = Backbone.Model.extend({
    defaults: {
        following_traders: new FollowingRels(),
        deals: new Deals()
    },

    initialize: function() {
        DISPATCHER.on("noti:deal:created noti:deal:updated", () => {
            this.get("deals").fetch();
        });

        DISPATCHER.on("noti:account:updated", () => {
            this.fetch();
        });
    },

    parse: function(data) {
        var data = data.result;
        this.get("following_traders").url = "/api/v1/follower/" + data.username + "/following";
        this.get("following_traders").fetch();

        this.get("deals").url = "/api/v1/follower/" + data.username + "/deals";
        this.get("deals").fetch();
        return data;
    },

    getAvatar: function() {
        return generateAvatar(this.id);
    }
});


class NotificationStore {
    constructor(address, dispatcher) {
        this.dispatcher = dispatcher;
        this.conn = new SockJS(address);

        this.conn.onopen = this.onOpen.bind(this);
        this.conn.onmessage = this.onMessage.bind(this);
        this.conn.onclose = this.onClose.bind(this);
        this.conn.onError = this.onError.bind(this);
    }

    onError(e) {
        this.dispatcher.trigger("noti:error", e);
    }

    onOpen(e) {
        console.log("Websocket connection established!");
        this.dispatcher.trigger("noti:open", e);
    }

    onMessage(e) {
        this.dispatcher.trigger("noti:" + e.data.headers.topic, e.data.payload);
    }

    onClose(e) {
        this.dispatcher.trigger("noti:close", e);
    }

    close() {
        this.conn.close();
    }
}

var Stock = Backbone.Model.extend({
    idAttribute: "code"
});


var StockStore = Backbone.Collection.extend({
    model: Stock,

    initialize: function (models, options) {
        this.models = models;
        this.dispatcher = options.dispatcher;

        this.sock = SockJS(options.priceServer + "/realtime");
        this.sock.onopen = () => {
            this.send({"type":"post","data":{"sequence":0,"params":{"name":"TRANSACTION","symbol":""}}});
            this.send({"type":"requestFullData","data":{"sequence":0}});
            this.send({"type":"registConsumer","data":{"sequence":0,"params":{"name":"STOCK","codes":["ITC", "KMR", "DCL"]}}});
        };

        this.sock.onmessage = (event) => {
            var message = JSON.parse(event.data);
            var data;

            if (message.type === "returnData" && message.data.name !== "TRANSACTION") {
                data = message.data.data;
            } else if (message.type === "STOCK") {
                data = [message.data];
            }

            _.each(data, (stockInfo) => {
                var parsed = this.parseStockMessage(stockInfo);
                this.add(parsed);

                this.dispatcher.trigger(`stock:changed`);
                this.dispatcher.trigger(`stock:${parsed.code}:changed`);
            });
        };
    },

    parseStockMessage: function(message) {
        var arr = message.split("|");
        var stockInfo = {};
        var scale = 1000;

        stockInfo.floorCode      = arr[0];
        stockInfo.tradingDate    = new Date(parseInt(arr[1]));
        stockInfo.time           = arr[2];
        stockInfo.code           = arr[3];
        stockInfo.companyName    = arr[4];
        stockInfo.stockType      = arr[5];
        stockInfo.totalRoom      = parseFloat(arr[6]);
        stockInfo.currentRoom    = parseFloat(arr[7]);
        stockInfo.basicPrice     = scale * parseFloat(arr[8]);
        stockInfo.openPrice      = scale * parseFloat(arr[9]);
        stockInfo.closePrice     = scale * parseFloat(arr[10]);
        stockInfo.currentPrice   = scale * parseFloat(arr[11]);
        stockInfo.currentQtty    = parseInt(arr[12]);
        stockInfo.highestPrice   = scale * parseFloat(arr[13]);
        stockInfo.lowestPrice    = scale * parseFloat( arr[14]);
        stockInfo.ceilingPrice   = scale * parseFloat(arr[15]);
        stockInfo.floorPrice     = scale * parseFloat(arr[16]);
        stockInfo.totalOfferQtty = parseInt(arr[17]);
        stockInfo.totalBidQtty   = parseInt(arr[18]);
        stockInfo.matchPrice     = scale * parseFloat(arr[19]);
        stockInfo.matchQtty      = parseInt(arr[20]);
        stockInfo.matchValue     = scale * parseFloat(arr[21]);
        stockInfo.averagePrice   = scale * parseFloat(arr[22]);
        stockInfo.bidPrice01     = scale * parseFloat(arr[23]);
        stockInfo.bidQtty01      = parseInt(arr[24]);
        stockInfo.bidPrice02     = scale * parseFloat(arr[25]);
        stockInfo.bidQtty02      = parseInt(arr[26]);
        stockInfo.bidPrice03     = scale * parseFloat(arr[27]);
        stockInfo.bidQtty03      = parseInt(arr[28]);
        stockInfo.offerPrice01   = scale * parseFloat(arr[29]);
        stockInfo.offerQtty01    = parseInt(arr[30]);
        stockInfo.offerPrice02   = scale * parseFloat(arr[31]);
        stockInfo.offerQtty02    = parseInt(arr[32]);
        stockInfo.offerPrice03   = scale * parseFloat(arr[33]);
        stockInfo.offerQtty03    = parseInt(arr[34]);

        return stockInfo;
    },

    send: function (object) {
        this.sock.send(JSON.stringify(object));
    }
});

export var stockStore = new StockStore([], {priceServer: "priceservice.vndirect.com.vn", dispatcher: DISPATCHER});
export var notificationStore = new NotificationStore("/realtime", DISPATCHER);
