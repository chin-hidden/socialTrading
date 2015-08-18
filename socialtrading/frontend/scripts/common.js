"use strict";

import Backbone from "backbone";
import _ from "underscore";
import SockJS from "sockjs-client";
import {Traders, Follower} from "./models";


export var DISPATCHER = {};
_.extend(DISPATCHER, Backbone.Events);
DISPATCHER.on("all", (eventName) => {
	console.log(eventName);
});


class NotificationStore {
	constructor(address, dispatcher) {
		this.dispatcher = dispatcher;
		this.conn = new SockJS(address);

		this.conn.onopen = this.onOpen.bind(this);
		this.conn.onmessage = this.onMessage.bind(this);
		this.conn.onclose = this.onClose.bind(this);
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

// A collection of all traders
export var traders = new Traders();

// me is the global object representing the logged in user.
export var me = new Follower();
me.url = "/api/v1/follower/" + USERNAME;

export function loadData() {
	return me.fetch().then(function() {return traders.fetch();});
}
