define(['exports'], function (exports) {
    'use strict';

    $(document).ready(function () {
        traders = new Traders();
        me = new Follower();
        me.url = "/api/v1/follower/" + user.id;
        me.fetch().then(function () {
            traders.fetch();
        }).then(function () {
            React.render(React.createElement(AccountScreen, null), document.getElementById('app'));
        });
    });
});
//# sourceMappingURL=main.js.map