import React from "react";
import {AccountScreen} from "./components/AccountScreen.jsx";
import {loadData} from "./common";
import "./csrf";

loadData().then(function() {
    React.render(
        <AccountScreen/>,
        document.getElementById('app')
    );
});
