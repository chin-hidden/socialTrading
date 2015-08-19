import Backbone from "backbone";
import {DISPATCHER} from "./common";

//
// These models are the "stores" in Facebook's Flux architecture
// The properties of these models follow Python's snake_case convention.
//

export var Traders = Backbone.Collection.extend({
    url: "/api/v1/traders",

    model: Backbone.Model.extend({
        getAvatar: function() {
            return `https://sigil.cupcake.io/${this.id}?w=144`;
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
    parse: function(data) {
        return data.result;
    }
});


var Deals = Backbone.Collection.extend({
    model: Backbone.Model.extend({
        initialize: function() {
            this.id = this.get("username") + this.get("mimicking_username") + this.get("symbol");
        }
    }),
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
        DISPATCHER.on("noti:order_executed", () => {
            this.get("deals").fetch();
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
        return `https://sigil.cupcake.io/${this.id}?w=144`;
    }
});
