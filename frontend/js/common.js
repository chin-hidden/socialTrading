// global USERNAME

import {Traders, Follower} from "models";

// A collection of all traders
export var traders = new Traders();

// me is the global object representing the logged in user.
export var me = new Follower();
me.url = "/api/v1/follower/" + USERNAME;

export function loadData() {
	return me.fetch().then(function() {return traders.fetch();});
}
