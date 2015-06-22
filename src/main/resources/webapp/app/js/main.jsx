'use strict';


ActionTypes = {
	FOLLOW_TRADER: "FOLLOW_TRADER",
	UNFOLLOW_TRADER: "UNFOLLOW_TRADER"
};


var TraderLine = React.createClass({
    followBtnToggled: function() {
        if (me.isFollowing(this.props.trader)) {
            dispatcher.dispatch({
                type: ActionTypes.FOLLOW_TRADER,
                trader: this.props.trader
            });
        } else {
            dispatcher.dispatch({
                type: ActionTypes.UNFOLLOW_TRADER,
                trader: this.props.trader
            });
        }
    },

    render: function() {
        var followBtnClasses = "btn ";
        if (me.isFollowing(this.props.trader)) {
            var followButtonText = "Unfollow";
            followBtnClasses += "btn-danger";
        } else {
            followButtonText = "Follow";
            followBtnClasses += "btn-primary";
        }

        return (
            <div className="traderLine clearfix">
              <div className="block">
                <img src="/img/trader1.jpg" className="img-thumbnail"/>
              </div>

              <div className="block basic-info">
                <h2>{this.props.trader.get("name")}</h2>
                <p className="text-muted">
                  {this.props.trader.get("id")}
                  {this.props.trader.get("description")}
                </p>
              </div>

              <div className="block">
                <span className="text-label">NAV</span><br/>
                <strong className="text-success">${this.props.trader.get("cash")}</strong><br/>

                <span className="text-label">Số người copy</span><br/>
                <strong className="text-success">{this.props.trader.get("peopleFollowing")}</strong><br/>

              </div>

              <div className="block">
                <span className="text-label">ROI</span><br/>
                <strong className="text-success">{this.props.trader.get("roi")}%</strong>
                {/* <button type="submit" 
                   className={followBtnClasses}
                   onClick={this.followBtnToggled}>{{followButtonText}}</button> */}
              </div>
            </div>
        );
    }
});

var TraderList = React.createClass({
    componentDidMount: function() {
        var _this = this;

        me.on("change add remove", function() {
            _this.forceUpdate();
        });

        me.get("followingTraders").on("change", function() {
            console.log("followingTraders changed")
                _this.forceUpdate();
        });

        this.props.traders.on("change add remove reset", function() {
            _this.forceUpdate();
        });
    },

    render: function() {
        var nodes = this.props.traders.map(function(trader) {
            return (
                <TraderLine trader={trader}/>
            );
        });

        return (
            <div className="trader-list">
              {nodes}
            </div>
        );
    }
});

var NavBar = React.createClass({
    logout: function() {
        $.post("/api/v1/logout").then(function() {
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
                            Xin chào, {me.id}!
                        </button>
                    </li>

                    <li><button className="btn btn-default navbar-btn" onClick={this.logout}>Logout</button></li>
                </ul>
            );
        }

        return (
            <nav className="navbar navbar-default">
              <div className="container-fluid">
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
        dispatcher.register(function(message) {
            switch(message.type) {
                case "auth.authenticated":

		if (message.accountType === "FOLLOWER") {
		    _this.setState({authChecking: false, loggedIn: true});

		    me = new Follower();
		    me.url = "/api/v1/follower/" + message.accountNumber;
		    me.fetch().then(function() {
			_this.props.router.navigate("wizard", {trigger: true});
		    });
		} else {
		    alert("Xin lỗi quý khách. Hiện chúng tôi chưa hỗ trợ đăng nhập cho trader.")
		}

	    }
        });

        this.props.router.on("route", function() {
            _this.forceUpdate();
        })
    },

    getInitialState: function() {
        var _this = this;
	$.get("/api/v1/login").then(function() {
	    _this.setState({authChecking: false, loggedIn: true});
	    _this.forceUpdate();
	}).fail(function() {
	    _this.setState({authChecking: false, loggedIn: false});
	    _this.forceUpdate();
	});

	return {
	    authChecking: true,
            loggedIn: false
        };
    },

    startInvesting: function() {
        // TODO Check if this is the first time this user logged in
        this.props.router.navigate(this.state.loggedIn ? "wizard" : "login", {trigger: true});
    },

    wizardCompleted: function() {
        this.props.router.navigate("account", {trigger: true});
    },

    render: function() {
        // FIXME Proper routing
        var inner;
        if (this.props.router.current === "index") {
            inner = <HomeScreen onTransit={this.startInvesting}/>;
        } else if (this.props.router.current === "login") {
            if (this.state.authChecking) {
                inner = (<h2>Checking authentication...</h2>);
            } else {
                inner = <LoginScreen/>;
            }
        } else if (this.props.router.current === "wizard") {
            inner = <WizardScreen onCompletion={this.wizardCompleted}/>
        } else if (this.props.router.current === "account") {
            inner = <AccountScreen/>
        }

        return (
            <div className="container-fluid top-container">
                <NavBar/>
                {inner}

                <footer>
                <span>Bản quyền © Công ty cổ phần chứng khoán VNDIRECT</span>
                </footer>
            </div>
        );
    }
});

var LoginScreen = React.createClass({
    login: function() {
        $.post("/api/v1/login", {
            "username": this.refs.username.getDOMNode().value,
            "password": this.refs.password.getDOMNode().value
        }).then(function(data) {
            dispatcher.dispatch({
                type: "auth.authenticated",
		accountType: data["type"],
		accountNumber: data["accountNumber"]
            });
        }).fail(function() {
            alert("NOPE!")
        });
    },

    render: function() {
        return (
        <div className="form-login">
            <h2>Mời quý khách đăng nhập</h2>
            <input className="form-control" type="text" ref="username" placeholder="Tên đăng nhập"/>
            <input className="form-control" type="password" ref="password" placeholder="Mật khẩu"/>
            <input className="btn btn-primary btn-block" type="submit" value="Đăng nhập" onClick={this.login}/>
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
        "login": "login",
        "wizard": "wizard",
        "account": "account"
    },

    index: function() {
        this.current = "index";
    },

    login: function() {
        this.current = "login";
    },

    wizard: function() {
        if (!isLoggedIn()) {
            this.navigate("login", {trigger: true});
            return;
        }
        this.current = "wizard";
    },

    account: function() {
        if (!isLoggedIn()) {
            this.navigate("login", {trigger: true});
            return;
        }
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
	    document.getElementById('example')
    );
    Backbone.history.start();
});
