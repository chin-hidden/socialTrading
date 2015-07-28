define(["exports", "common", "csrf", "accountScreen"], function (exports, _common, _csrf, _accountScreen) {
    "use strict";

    (0, _common.loadData)().then(function () {
        React.render(React.createElement(_accountScreen.AccountScreen, null), document.getElementById('app'));
    });
});
//# sourceMappingURL=accountapp.js.map