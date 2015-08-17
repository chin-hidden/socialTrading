import Backbone from "backbone";

//
// These models are the "stores" in Facebook's Flux architecture
// The properties of these models follow Python's snake_case convention.
//

export var Traders = Backbone.Collection.extend({
    url: "/api/v1/traders",

    comparator: function(item) {
        return item.get('id');
    },

    parse: function(data) {
        return data.result;
    }
});

export var FollowingRels = Backbone.Collection.extend({
    parse: function(data) {
        return data.result;
    }
});


var FollowerPositions = Backbone.Collection.extend({
    parse: function(data) {
        return data.result;
    }
});

export var Follower = Backbone.Model.extend({
    defaults: {
        following_traders: new FollowingRels(),
        positions: new FollowerPositions(),
        first_login: true,
        risk_factor: 0,
        cash: 0,
        profit: 0,
        total_current_value: 0,
        stock_value: 0,
    },

    initialize: function() {
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

    parse: function(data) {
        var data = data.result;
        this.get("following_traders").url = "/api/v1/follower/" + data.username + "/following";
        this.get("following_traders").fetch();

        this.get("positions").url = "/api/v1/follower/" + data.username + "/positions";
        this.get("positions").fetch();
        return data;
    },

    isFollowing: function(trader) {
        return this.get("following_traders").get(trader.id) !== undefined;
    }
});
