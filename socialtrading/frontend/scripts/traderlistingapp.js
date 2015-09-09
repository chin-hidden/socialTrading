import "./csrf";

import {TraderListingScreen} from "./components/TraderListingScreen.jsx";
import React from "react";
import * as models from "./models";

var traders = new models.Traders();
var me = new models.Follower();

if (typeof USERNAME !== 'undefined') {
    me.url = "/api/v1/follower/" + USERNAME;
} else {
    me.fetch = () => {};
}

Promise.all([
    traders.fetch(),
    me.fetch(),
]).then(() => {
    React.render(
        <TraderListingScreen me={me} traders={traders}/>,
        document.getElementById('app')
    );
});

