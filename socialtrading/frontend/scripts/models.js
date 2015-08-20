import Backbone from "backbone";
import DISPATCHER from "./dispatcher";

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

    isFollowing: function(trader) {
        return this.get("following_traders").get(trader.id) !== undefined;
    },

    getAvatar: function() {
        return generateAvatar(this.id);
    }
});
