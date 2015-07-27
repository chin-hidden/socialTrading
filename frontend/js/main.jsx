'use strict';


$(document).ready(function() {
    traders = new Traders();
    me = new Follower();
    me.url = "/api/v1/follower/" + user.id;
    me.fetch().then(function() {traders.fetch()}).then(function() {
        React.render(
            <AccountScreen/>,
            document.getElementById('app')
        );
    });
});
