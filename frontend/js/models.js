//
// These models are the "stores" in Facebook's Flux architecture
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
    model: Backbone.Model.extend({
        idAttribute: "traderId"
    }),
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
    idAttribute: "username",

    defaults: {
        followingTraders: new FollowingRels(),
        positions: new FollowerPositions(),
        firstLogin: true,
        riskFactor: 0,
        cash: 0,
        profit: 0,
        totalCurrentValue: 0,
        stockValue: 0,
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
        this.get("followingTraders").url = "/api/v1/follower/" + data.username + "/following";
        this.get("followingTraders").fetch();

        this.get("positions").url = "/api/v1/follower/" + data.username + "/positions";
        this.get("positions").fetch();
        return data;
    },

    isFollowing: function(trader) {
        return this.get("followingTraders").get(trader.get("id")) !== undefined;
    }
});
