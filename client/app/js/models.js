//
// These models are the "stores" in Facebook's Flux architecture
//

var Traders = Backbone.Collection.extend({
    model: Backbone.Model.extend({
        idAttribute: "accountNumber"
    }),
    url: "/api/v1/traders",

    comparator: function(item) {
        return item.get('id');
    }
});

var FollowingRels = Backbone.Collection.extend({
    model: Backbone.Model.extend({
        idAttribute: "traderId"
    }),
});

var Follower = Backbone.Model.extend({
    idAttribute: "accountNumber",

    defaults: {
        followingTraders: new FollowingRels(),
        positions: new Backbone.Collection(),
        firstLogin: true,
    },

    initialize: function() {
        var _this = this;

        dispatcher.register(function(message) {
            switch (message.type) {
                case "ask_to_follow_trader":
                    $.post("/api/v1/follower/" + _this.id + "/following", {
                        traderid: message.trader.id,
                        money: message.allocatedMoney,
                        maxopen: 3
                    }).then(function() {
                        _this.fetch();
                        traders.fetch();
                    });
                    break;
                case "ask_to_unfollow_trader":
                    $.ajax({
                        url: "/api/v1/follower/" + _this.id + "/following/" + message.trader.id,
                        method: "DELETE",
                        success: function() {
                            _this.fetch();
                            traders.fetch();
                        }
                    });
                    break;
            }
        });

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

    parse: function(res) {
        console.log(res);
        this.get("followingTraders").url = "/api/v1/follower/" + res.accountNumber + "/following";
        this.get("followingTraders").fetch();

        this.get("positions").url = "/api/v1/follower/" + res.accountNumber + "/positions";
        this.get("positions").fetch();
        return res;
    },

    isFollowing: function(trader) {
        return this.get("followingTraders").get(trader.get("id")) !== undefined;
    }
});
