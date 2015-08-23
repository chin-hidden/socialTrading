import Backbone from "backbone";
import DISPATCHER from "./dispatcher";
import SockJS from "sockjs-client";
import _ from "underscore";

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

    getAvatar: function() {
        return generateAvatar(this.id);
    }
});


class NotificationStore {
    constructor(address, dispatcher) {
        this.dispatcher = dispatcher;
        this.conn = new SockJS(address);

        this.conn.onopen = this.onOpen.bind(this);
        this.conn.onmessage = this.onMessage.bind(this);
        this.conn.onclose = this.onClose.bind(this);
        this.conn.onError = this.onError.bind(this);
    }

    onError(e) {
        this.dispatcher.trigger("noti:error", e);
    }

    onOpen(e) {
        console.log("Websocket connection established!");
        this.dispatcher.trigger("noti:open", e);
    }

    onMessage(e) {
        this.dispatcher.trigger("noti:" + e.data.headers.topic, e.data.payload);
    }

    onClose(e) {
        this.dispatcher.trigger("noti:close", e);
    }

    close() {
        this.conn.close();
    }
}

var notificationStore = new NotificationStore("/realtime", DISPATCHER);
