define(["exports"], function (exports) {
    //
    // These models are the "stores" in Facebook's Flux architecture
    //

    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Traders = Backbone.Collection.extend({
        url: "/api/v1/traders",

        comparator: function comparator(item) {
            return item.get('id');
        },

        parse: function parse(data) {
            return data.result;
        }
    });

    exports.Traders = Traders;
    var FollowingRels = Backbone.Collection.extend({
        model: Backbone.Model.extend({
            idAttribute: "traderId"
        }),
        parse: function parse(data) {
            return data.result;
        }
    });

    exports.FollowingRels = FollowingRels;
    var FollowerPositions = Backbone.Collection.extend({
        parse: function parse(data) {
            return data.result;
        }
    });

    var Follower = Backbone.Model.extend({
        idAttribute: "username",

        defaults: {
            followingTraders: new FollowingRels(),
            positions: new FollowerPositions(),
            firstLogin: true,
            riskFactor: 0,
            cash: 0,
            profit: 0,
            totalCurrentValue: 0,
            stockValue: 0
        },

        initialize: function initialize() {
            var _this = this;

            // dispatcher.register(function(message) {
            //     switch (message.type) {
            //         case "ask_to_follow_trader":
            //             $.post("/api/v1/follower/" + _this.id + "/following", {
            //                 traderid: message.trader.id,
            //                 money: message.allocatedMoney,
            //                 maxopen: 3
            //             }).then(function() {
            //                 _this.fetch();
            //                 traders.fetch();
            //             });
            //             break;
            //         case "ask_to_unfollow_trader":
            //             $.ajax({
            //                 url: "/api/v1/follower/" + _this.id + "/following/" + message.trader.id,
            //                 method: "DELETE",
            //                 success: function() {
            //                     _this.fetch();
            //                     traders.fetch();
            //                 }
            //             });
            //             break;
            //     }
            // });
        },

        parse: function parse(data) {
            var data = data.result;
            this.get("followingTraders").url = "/api/v1/follower/" + data.username + "/following";
            this.get("followingTraders").fetch();

            this.get("positions").url = "/api/v1/follower/" + data.username + "/positions";
            this.get("positions").fetch();
            return data;
        },

        isFollowing: function isFollowing(trader) {
            return this.get("followingTraders").get(trader.get("id")) !== undefined;
        }
    });
    exports.Follower = Follower;
});
//# sourceMappingURL=models.js.map