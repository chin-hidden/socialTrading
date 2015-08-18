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


var FollowerPositions = Backbone.Collection.extend({
    parse: function(data) {
        return data.result;
    }
});

export var Follower = Backbone.Model.extend({
    defaults: {
        following_traders: new FollowingRels(),
        positions: new FollowerPositions()
    },

    initialize: function() {
        DISPATCHER.on("noti:order_executed", () => {
            this.get("positions").fetch();
        });
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
    },

    getAvatar: function() {
        return `https://sigil.cupcake.io/${this.id}?w=144`;
    }
});
