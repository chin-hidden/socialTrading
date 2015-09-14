import Backbone from "backbone";
import _ from "underscore";
import SockJS from "sockjs-client";
import {notificationStore} from "./server-noti";

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
            this.cid = this.get("follower_id") + this.get("trader_id");
        },

        url: function() {
            return `/api/v1/follower/${this.get('follower_id')}/following/${this.get('trader_id')}`;
        },

        parse: function(data) {
            data['id'] = data['follower_id'] + data['trader_id'];
            return data;
        }
    }),

    getByTraderAndFollower(followerId, traderId) {
        return this.get(followerId + traderId);
    },

    initialize: function() {
        notificationStore.on("noti:deal:created noti:deal:updated", () => {
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
        notificationStore.on("noti:deal:created noti:deal:updated", () => {
            this.get("deals").fetch();
        });

        // DISPATCHER.on("noti:account:updated", () => {
        //     this.fetch();
        // });

        this.get("following_traders").on("change update", () => {
            this.trigger("change");
        });

        this.get("deals").on("change update", () => {
            this.trigger("change");
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
    },

    isFollowing: function(trader) {
        return _.any(this.get("following_traders").map((rel) => {
            return rel.get("trader_id") === trader.id;
        }));
    },

    follow: function(traderId) {
        var rels = this.get("following_traders");
        console.log("here");
        return rels.create({
            "follower_id": this.id,
            "trader_id": traderId
        }, {
            url: "/api/v1/follower/" + this.id + "/following"
        });
    },

    unfollow: function(traderId) {
        var followings = this.get("following_traders");
        var rel = followings.getByTraderAndFollower(this.id, traderId);
        followings.remove(rel);
        rel.destroy();
    }
});


var Stock = Backbone.Model.extend({
    idAttribute: "code"
});



// FIXME: Add functionality to register a specific stock symbol
export var StockStore = Backbone.Collection.extend({
    model: Stock,

    initialize: function (models, options) {
        this.models = models;

        this.sock = SockJS(options.priceServer + "/realtime");
        this.sock.onopen = () => {
            this.send({"type":"post","data":{"sequence":0,"params":{"name":"TRANSACTION","symbol":""}}});
            this.send({"type":"requestFullData","data":{"sequence":0}});
            this.send({"type":"registConsumer","data":{"sequence":0,"params":{"name":"STOCK","codes":["AAA","ACB","ADC","ALT","ALV","AMC","AME","AMV","APG","API","APP","APS","ARM","ASA","B82","BAM","BBS","BCC","BDB","BED","BHT","BII","BKC","BLF","BPC","BSC","BST","BTH","BTS","BVG","BVS","BXH","C92","CAN","CAP","CCM","CEO","CHP","CID","CJC","CKV","CMC","CMI","CMS","CPC","CSC","CT6","CTA","CTB","CTC","CTM","CTN","CTS","CTV","CTX","CVN","CVT","CX8","D11","DAC","DAD","DAE","DBC","DBT","DC2","DC4","DCS","DGC","DHP","DHT","DID","DIH","DL1","DLR","DNC","DNM","DNP","DNY","DPC","DST","DXP","DZM","EBS","ECI","EFI","EID","FDT","GLT","GMX","HAD","HAT","HBE","HBS","HCC","HCT","HDA","HDO","HEV","HGM","HHC","HHG","HJS","HLC","HLD","HLY","HMH","HNM","HOM","HPC","HPS","HST","HTC","HTP","HUT","HVT","ICG","IDJ","IDV","INC","INN","ITQ","IVS","KHB","KHL","KKC","KLF","KLS","KMT","KSD","KSK","KSQ","KST","KTS","KTT","L14","L18","L35","L43","L44","L61","L62","LAS","LBE","LCD","LCS","LDP","LHC","LIG","LM7","LO5","LTC","LUT","MAC","MAS","MAX","MCC","MCF","MCO","MDC","MEC","MHL","MIM","MKV","MNC","NAG","NBC","NBP","NDF","NDN","NDX","NET","NFC","NGC","NHA","NHC","NIS","NLC","NPS","NST","NTP","NVB","OCH","ONE","ORS","PCG","PCT","PDC","PEN","PGS","PGT","PHC","PHS","PIV","PJC","PLC","PMC","PMS","POT","PPE","PPP","PPS","PRC","PSC","PSD","PSI","PTI","PTS","PV2","PVB","PVC","PVE","PVG","PVI","PVL","PVR","PVS","PVV","PVX","PXA","QHD","QNC","QST","QTC","RCL","RHC","S12","S55","S74","S91","S99","SAF","SAP","SCJ","SCL","SCR","SD2","SD4","SD5","SD6","SD7","SD9","SDA","SDC","SDD","SDE","SDG","SDH","SDN","SDP","SDT","SDU","SDY","SEB","SED","SFN","SGC","SGD","SGH","SHA","SHB","SHN","SHS","SIC","SJ1","SJC","SJE","SKS","SLS","SMT","SNG","SPI","SPP","SQC","SRA","SRB","SSM","STC","STP","SVN","TAG","TBX","TC6","TCS","TCT","TDN","TET","TH1","THB","THS","THT","TIG","TJC","TKC","TKU","TMC","TMX","TNG","TPH","TPP","TSB","TSM","TST","TTC","TTZ","TV2","TV3","TV4","TVC","TVD","TXM","UNI","V12","V21","VAT","VBC","VBH","VC1","VC2","VC3","VC5","VC6","VC7","VC9","VCC","VCG","VCM","VCR","VCS","VDL","VDS","VE1","VE2","VE3","VE4","VE8","VE9","VFR","VGP","VGS","VHL","VIE","VIG","VIT","VIX","VKC","VLA","VMC","VMI","VNC","VND","VNF","VNR","VNT","VTC","VTH","VTL","VTS","VTV","VXB","WCS","WSS","DPS","KVC","PDB","E1SSHN30","PCE","NHP","PBP","ACM","TA9","DP3","PSE","CTT","TTB","HKB","HVA","PHP","SMN","PSW","FID","G20", "ITC", "KMR", "DCL"]}}});
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

                // this.dispatcher.trigger(`stock:changed`);
                // this.dispatcher.trigger(`stock:${parsed.code}:changed`);
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
