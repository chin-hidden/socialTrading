import "./csrf";

import {WizardScreen} from "./components/WizardScreen.jsx";
import {loadData} from "./common";
import React from "react";

loadData().then(function() {
    React.render(
        <WizardScreen/>,
        document.getElementById('app')
    );
});
