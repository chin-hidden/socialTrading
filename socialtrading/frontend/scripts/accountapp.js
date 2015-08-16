import "./csrf";
import React from "react";
import {AccountScreen} from "./accountScreen";
import {loadData} from "./common";

loadData().then(function() {
    React.render(
        <AccountScreen/>,
        document.getElementById('app')
    );
});
