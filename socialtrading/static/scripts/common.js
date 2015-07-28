define(["exports", "models"], function (exports, _models) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.loadData = loadData;

	// A collection of all traders
	var traders = new _models.Traders();

	// me is the global object representing the logged in user.
	exports.traders = traders;
	var me = new _models.Follower();
	exports.me = me;
	me.url = "/api/v1/follower/" + user.username;

	function loadData() {
		return me.fetch().then(function () {
			return traders.fetch();
		});
	}
});
//# sourceMappingURL=common.js.map