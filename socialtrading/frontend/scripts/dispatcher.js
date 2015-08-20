"use strict";

import _ from "underscore";
import Backbone from "backbone";

var DISPATCHER = {};
_.extend(DISPATCHER, Backbone.Events);
DISPATCHER.on("all", (eventName) => {
	console.log(eventName);
});

export default DISPATCHER;
