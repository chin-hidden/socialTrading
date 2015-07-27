import "common";
import "csrf";

import {AccountScreen} from "accountScreen";
import {loadData} from "common";

loadData().then(function() {
    React.render(
        <AccountScreen/>,
        document.getElementById('app')
    );
});
