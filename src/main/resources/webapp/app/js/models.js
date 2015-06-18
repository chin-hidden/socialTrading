var Traders = Backbone.Collection.extend({
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
    defaults: {
        followingTraders: new FollowingRels()
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
    },

    parse: function(res) {
        var _this = this;
        console.log("parsing follower");
        this.get("followingTraders").url = "/api/v1/follower/" + this.id + "/following";
        this.get("followingTraders").fetch().then(function() {
            console.log("followingTraders fetched")
                _this.get("followingTraders").trigger("change")
        });
        return res;
    },

    isFollowing: function(trader) {
        return this.get("followingTraders").get(trader.get("id")) !== undefined;
    }
});
