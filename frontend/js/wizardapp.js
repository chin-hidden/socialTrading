import "common";
import "csrf";

import {WizardScreen} from "wizardScreen";
import {loadData} from "common";

loadData().then(function() {
    React.render(
        <WizardScreen/>,
        document.getElementById('app')
    );
});
