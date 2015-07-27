//
// These models are the "stores" in Facebook's Flux architecture
//

var Traders = Backbone.Collection.extend({
    url: "/api/v1/traders",

    comparator: function(item) {
        return item.get('id');
    },

    parse: function(data) {
        return data.result;
    }
});

var FollowingRels = Backbone.Collection.extend({
    model: Backbone.Model.extend({
        idAttribute: "traderId"
    }),
    parse: function(data) {
        return data.result;
    }
});

var Follower = Backbone.Model.extend({

    defaults: {
        followingTraders: new FollowingRels(),
        positions: new Backbone.Collection(),
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

        // Setup the notification
        var socket = SockJS("/hello");
        var stompClient = Stomp.over(socket);
        var self = this;

        stompClient.connect({}, function (frame) {
            console.log(frame);
            stompClient.subscribe("/user/queue/executed-orders", function(msg) {
                console.log("Executed Order: ");
                self.get("positions").fetch();
            });
        });
    },

    parse: function(data) {
        var data = data.result;
        this.get("followingTraders").url = "/api/v1/follower/" + data.id + "/following";
        this.get("followingTraders").fetch();

        this.get("positions").url = "/api/v1/follower/" + data.id + "/positions";
        this.get("positions").fetch();
        return data;
    },

    isFollowing: function(trader) {
        return this.get("followingTraders").get(trader.get("id")) !== undefined;
    }
});
