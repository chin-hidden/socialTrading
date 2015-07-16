'use strict';


ActionTypes = {
	FOLLOW_TRADER: "FOLLOW_TRADER",
	UNFOLLOW_TRADER: "UNFOLLOW_TRADER"
};


var NavBar = React.createClass({
    logout: function() {
        $.post("/logout").then(function() {
            location.reload();
        }).fail(function() {
            alert("Lỗi. Không thể đăng xuất!");
        });
    },

    showWizardScreen: function() {
        router.navigate("wizard", {trigger: true});
    },

    render: function() {
        if (isLoggedIn()) {
            var accountControls = (
                <ul className="nav navbar-nav navbar-right">
                    <li><button className="btn btn-primary navbar-btn"
                                onClick={this.showWizardScreen}>
                            Xin chào, {me.get("name")}!
                        </button>
                    </li>

                    <li><button className="btn btn-default navbar-btn" onClick={this.logout}>Logout</button></li>
                </ul>
            );
        }

        return (
            <nav className="navbar navbar-default">
              <div className="container">
                <div className="navbar-header">
                  <a className="navbar-brand" href="#">
                    <span className="accent">A</span>utotrade
                  </a>
                </div>

                <div className="collapse navbar-collapse">
                    {accountControls}
                </div>
              </div>
            </nav>
        );
    }
});

var App = React.createClass({
    componentDidMount: function() {
        var _this = this;

        this.props.router.on("route", function() {
            _this.forceUpdate();
        });
    },

    getInitialState: function() {
        var _this = this;
        $.get("/api/v1/account").then(function(account) {
            me = new Follower();
            me.url = "/api/v1/follower/" + account.result.id;
            me.fetch().then(function() {
                _this.setState({authChecking: false, loggedIn: true});
                _this.forceUpdate();
            });

        }).fail(function() {
            // FIXME Retry?
            alert("Cannot connect to server!");
        });

        return {
            authChecking: true
        };
    },

    startInvesting: function() {
        if (me.get("firstLogin")) {
            me.set("firstLogin", true);
            me.save();
            this.props.router.navigate("wizard", {trigger: true});
        } else {
            this.showAccountPage();
        }
    },

    showAccountPage: function() {
        this.props.router.navigate("account", {trigger: true});
    },

    render: function() {
        if (this.state.authChecking) {
            return <h3>Loading...</h3>;
        }

        // FIXME Proper routing
        var inner;
        if (this.props.router.current === "index") {
            inner = <HomeScreen onTransit={this.startInvesting}/>;
        } else if (this.props.router.current === "wizard") {
            inner = <WizardScreen onCompletion={this.showAccountPage}/>;
        } else if (this.props.router.current === "account") {
            inner = <AccountScreen/>;
        }

        return (
            <div className="top-container">
                <NavBar/>

                <div className="container">
                    <ul className="nav nav-tabs">
                      <li className="active">
                        <a href="#account">
                          Trang của tôi
                        </a>
                      </li>
                      <li>
                        <a href="#traders">
                          Chiến lược gia
                        </a>
                      </li>
                      <li>
                        <a href="#help">
                          Tìm hiểu về AutoTrade
                        </a>
                      </li>
                    </ul>

                    {inner}
                </div>

                <footer>
                    <div className="container">
                        <span>Bản quyền © Công ty cổ phần chứng khoán VNDIRECT</span>
                    </div>
                </footer>
            </div>
        );
    }
});

var HomeScreen = React.createClass({
    transitToApp: function() {
        this.props.onTransit();
    },

    render: function() {
        var styles = {
            shoutout: {
                fontFamily: "Verdana",
                fontStyle: "italic",
                fontSize: 48,
                marginBottom: 30,
            },

            callToAction: {
                fontSize: 24
            }
        };

        return (
            <div className="home-container">

            <div className="hero">
                <h1 style={styles.shoutout}>Dễ hơn chơi lô,<br/> ngon hơn đánh đề!</h1>

                <div className="row">
                    <div className="col-md-8">
                        <p>
                        Mạng đầu tư <span className="accent">Autotrade</span> - 
                        Hệ thống tự động sao chép chiến lược giao dịch lãi nhất thị trường. 
                        </p>
                    </div>

                    <div className="col-md-4">
                        <button className="btn btn-lg btn-primary" style={styles.callToAction} onClick={this.transitToApp}>
                        Đầu tư ngay!
                        </button>
                    </div>
                </div>
            </div>

            <div className="row features">
                <div className="col-md-4">
                    <h3>Lãi nhất thị trường</h3>
                    <p>
                    Lựa chọn các chiến lược gia lãi nhất trên thị trường
                    và Autotrade sẽ tự động sao chép giao dịch của họ
                    vào tài khoản của bạn.
                    </p>
                </div>
                <div className="col-md-4">
                    <h3>Không tốn thời gian</h3>
                    <p>
                    Trong lúc bạn ngủ tiền tự đẻ ra tiền!
                    </p>
                </div>
                <div className="col-md-4">
                    <h3>Kết quả tức thời</h3>
                    <p>
                    Quản lý tài khoản dễ dàng, hiển thị minh bạch thông tin
                    đầu tư của bạn và Nhà đầu tư bạn theo dõi.
                    </p>
                </div>
            </div>

            </div>
        );
    }
});



var RiskSlider = React.createClass({
    componentDidMount: function() {
        var slider = this.refs.riskSlider.getDOMNode();
        var _this = this;

        // FIXME: we are calling `me` directly
        $(slider).noUiSlider({
            start: [ me.get("riskFactor") ],
            step: 10,
            connect: "lower",
            range: {
                'min': [  0 ],
                'max': [ 100 ]
            }
        }).noUiSlider_pips({
            mode: "positions",
            stepped: true,
            values: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            densitiy: 4
        }).on("change", function() {
            if (_this.props.onChange) {
                _this.props.onChange($(slider).val());
            }
        });
    },
    render: function() {
        return (<div ref="riskSlider" style={this.props.style}></div>);
    }
});


var Router = Backbone.Router.extend({
    routes: {
        "": "index",
        "wizard": "wizard",
        "account": "account"
    },

    index: function() {
        this.current = "index";
    },

    wizard: function() {
        this.current = "wizard";
    },

    account: function() {
        this.current = "account";
    }
});


function isLoggedIn() {
    return me !== undefined;
}


var dispatcher;
var traders;
var router;
var me;

$(document).ready(function() {
    dispatcher = new Flux.Dispatcher();
    traders = new Traders();

    dispatcher.register(function(message) {
        console.log(message);
    });
    router = new Router();
    traders.fetch();

    React.render(
	    <App router={router}/>,
	    document.getElementById('app')
    );
    Backbone.history.start();


    setupCsrf();
});


function setupCsrf() {
    // Code taken from Django's CSRF wiki page
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                // FIXME The header name is generated on the spring side
                xhr.setRequestHeader("X-CSRF-TOKEN", csrftoken);
            }
        }
    });
}

