"use strict";

import * as models from "./models";
import $ from "jquery";
import "jpillora/notifyjs/dist/notify-combined.min";
import "./notification";

$.notify.defaults({ className: "success"});

// A collection of all traders
export var traders = new models.Traders();

// me is the global object representing the logged in user.
export var me = new models.Follower();
me.url = "/api/v1/follower/" + USERNAME;

export function loadData() {
	return me.fetch().then(function() {return traders.fetch();});
}
