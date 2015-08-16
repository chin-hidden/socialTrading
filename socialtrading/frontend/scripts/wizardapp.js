import "./csrf";

import {WizardScreen} from "./wizardScreen";
import {loadData} from "./common";
import React from "react";

loadData().then(function() {
    React.render(
        <WizardScreen/>,
        document.getElementById('app')
    );
});
