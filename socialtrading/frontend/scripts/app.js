import React from "react";
import Backbone from "backbone";
import $ from "jquery";
import "jpillora/notifyjs/dist/notify-combined.min";

import {AccountScreen} from "./components/AccountScreen.jsx";
import TraderListingScreen from "./components/TraderListingScreen.jsx";
import * as models from "./models";
import * as utils from "./utils";
import "./csrf";
import "./notification";


function isLoggedIn() {
    return typeof USERNAME !== 'undefined';
}


// Global singletons
export var stockStore = new models.StockStore([], {priceServer: "priceservice.vndirect.com.vn"});
export var traders = new models.Traders();
export var follower = new models.Follower();


if (isLoggedIn()) {
    follower.url = "/api/v1/follower/" + USERNAME;
}

// Setup the notification bubbles
$.notify.defaults({ className: "success", position: "bottom right" });


function fetchData() {
    var promises = [
        traders.fetch(),
    ];

    if (isLoggedIn()) {
        promises.push(follower.fetch());
    }

    return Promise.all(promises);
}


var AppRouter = Backbone.Router.extend({
    routes: {
        "account": "account",
        "traders": "traders"
    }
});

var appRouter = new AppRouter();


appRouter.on("route:account", () => {
    if (!isLoggedIn()) {
        window.location = "/login?next=/app/account";
        return;
    }

    fetchData().then(() => {
        React.render(
            <AccountScreen/>,
            document.getElementById('app')
        );
    });
});

appRouter.on("route:traders", () => {
    fetchData().then(() => {
        React.render(
            <TraderListingScreen/>,
            document.getElementById('app')
        );
    });
});

Backbone.history.start({
    pushState: true,
    root: "/app/"
});
