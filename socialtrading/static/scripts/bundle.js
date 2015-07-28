var AccountScreen = React.createClass({displayName: "AccountScreen",
    getInitialState: function() {
        return {
            activeTab: "overview"
        };
    },

    switchTab: function(tabName, event) {
        event.preventDefault();
        this.setState({activeTab: tabName});
    },

    render: function() {
        var tabContent;

        var active = {};

        switch (this.state.activeTab) {
            default:
            case "overview":
                tabContent = (React.createElement(OverviewPanel, null));
                active["overview"] = "active";
                break;
            case "danhmuc":
                tabContent = (React.createElement(PositionPanel, null));
                active["danhmuc"] = "active";
        }

        return (
            React.createElement("div", null, 
              React.createElement(InfoBox, null), 

              React.createElement("ul", {className: "nav nav-tabs"}, 
                React.createElement("li", {className: active['overview']}, 
                  React.createElement("a", {href: "#", onClick: this.switchTab.bind(this, "overview")}, 
                    "Tổng quan"
                  )
                ), 
                React.createElement("li", {className: active['danhmuc']}, 
                  React.createElement("a", {href: "#", onClick: this.switchTab.bind(this, "danhmuc")}, 
                    "Danh mục đầu tư"
                  )
                ), 
                React.createElement("li", {className: active['solenh']}, 
                  React.createElement("a", {href: "#", onClick: this.switchTab.bind(this, "solenh")}, 
                    "Sổ lệnh trong ngày"
                  )
                ), 
                React.createElement("li", {className: active['lichsugd']}, 
                  React.createElement("a", {href: "#", onClick: this.switchTab.bind(this, "lichsugd")}, 
                    "Lịch sử giao dịch"
                  )
                )
              ), 

              tabContent
            )
        );
    }
});


var InfoBox = React.createClass({displayName: "InfoBox",
    riskSliderChanged: function(value) {
        me.set("riskFactor", Math.floor(value));
        me.save(null, {
            success: function() {
                alert("Đã lưu!");
            },
            error: function(model, response, options) {
                alert("Lỗi!");
                console.log(model, response, options);
            }
        });
    },

    render: function() {
        // FIXME Decouple from `me`
        var spacing = 20;

        var styles = {
            personalInfo: {
                float: "left",
                marginRight: spacing,
                minWidth: "8em"
            },
            accountInfo: {
                overflow: "hidden",
                fontSize: "16px",
                borderLeft: "1px solid #DDD",
                paddingLeft: spacing
            },
            accountInfoRow: {
                marginBottom: "1em"
            },
            riskSlider: {
                marginLeft: 10,
                marginRight: 10
            },
            label: {
                marginRight: "1em"
            },
        };

        return (
            React.createElement("div", {className: "panel panel-default"}, 
              React.createElement("div", {className: "panel-body clearfix"}, 
                React.createElement("div", {ref: "personalInfo", style: {float: "left", marginRight: spacing}}, 
                  React.createElement("img", {src: "/static/img/avatar.png", style: {height: 120}})
                ), 

                React.createElement("div", {ref: "personalInfo", style: styles.personalInfo}, 
                  React.createElement("strong", {style: {fontSize: "1.5em"}}, me.get("name")), React.createElement("br", null), 

                  React.createElement("div", null, 
                  me.get("id"), React.createElement("br", null), 
                  "TK: ", me.get("accountNumber")
                  )
                ), 

                React.createElement("div", {ref: "accountInfo", style: styles.accountInfo}, 
                  React.createElement("div", {className: "row", style: styles.accountInfoRow}, 
                    React.createElement("div", {className: "col-md-3"}, 
                      React.createElement("span", null, "Lợi nhuận"), React.createElement("br", null), 
                      React.createElement("strong", {className: "text-success"}, formatCurrency(me.get("profit")))
                    ), 
                    React.createElement("div", {className: "col-md-3"}, 
                      React.createElement("span", null, "Tài sản"), React.createElement("br", null), 
                      React.createElement("strong", {className: "text-success"}, formatCurrency(me.get("totalCurrentValue")))
                    ), 
                    React.createElement("div", {className: "col-md-3"}, 
                      React.createElement("span", null, "Chứng khoán"), React.createElement("br", null), 
                      React.createElement("strong", {className: "text-success"}, formatCurrency(me.get("stockValue")))
                    ), 
                    React.createElement("div", {className: "col-md-3"}, 
                      React.createElement("span", null, "Tiền mặt"), React.createElement("br", null), 
                      React.createElement("strong", {className: "text-success"}, formatCurrency(me.get("cash")))
                    )
                  ), 

                  React.createElement("div", {className: "row", style: styles.accountInfoRow}, 
                    React.createElement("div", {className: "col-md-12"}, 
                      React.createElement("h4", null, "Tốc độ đầu tư:"), 
                      React.createElement(RiskSlider, {ref: "riskSlider", 
                                  onChange: this.riskSliderChanged, 
                                  style: styles.riskSlider, 
                                  withoutPips: true})
                    )
                  )
                )
              )
            )
        );
    }
});


var PositionPanel = React.createClass({displayName: "PositionPanel",
    getInitialState: function() {
        return {
            viewType: "all"
        };
    },

    componentDidMount: function() {
        me.get("positions").on("change", this.render);
    },

    positions: function() {
        return new Backbone.Collection([
            new Backbone.Model({
                stock: "VND",
                quantity: 9000,
                buyingPrice: 8500,
                mimickingUser: "thachvu"
            }),
            new Backbone.Model({
                stock: "VND",
                quantity: 5000,
                buyingPrice: 8300,
                mimickingUser: "thachvu"
            }),
            new Backbone.Model({
                stock: "ACB",
                quantity: 8000,
                buyingPrice: 12000,
                mimickingUser: "giangnguyen"
            }),
        ]);
    },

    changeViewType: function(event) {
        this.setState({viewType: event.target.value});
    },

    positionRowsByTrader: function (positions) {
        var posByTrader = positions.groupBy("mimickingUser");
        var result = _.map(posByTrader, function (positions, traderAccount) {
            var rowsForThisTrader = _.map(positions, function (pos) {
                var marketPrice = 23000;
                var totalCost = pos.get("buyingPrice") * pos.get("quantity");
                var totalValue = marketPrice * pos.get("quantity");
                var gain = totalValue - totalCost;
                var roi = (gain / totalCost * 100).toFixed(2);
                return (
                    React.createElement("tr", null, 
                      React.createElement("td", null, pos.get("stock")), 
                      React.createElement("td", null, "HOSE"), 
                      React.createElement("td", null, pos.get("quantity")), 
                      React.createElement("td", null, formatCurrency(pos.get("buyingPrice"))), 
                      React.createElement("td", null, formatCurrency(marketPrice)), 
                      React.createElement("td", null, formatCurrency(totalCost)), 
                      React.createElement("td", null, formatCurrency(totalValue)), 
                      React.createElement("td", null, React.createElement("span", {className: "text-success"}, roi, "%"))
                    )
                );
            });

            var traderName = traders.get(traderAccount).get("name");

            var headerRow = (
                React.createElement("tr", {style: {backgroundColor: "#cbffaf"}}, 
                  React.createElement("td", {colSpan: "7"}, traderName), 
                  React.createElement("td", null, formatCurrency(25628674), " (25%)")
                )
            );

            return _.union([headerRow], rowsForThisTrader);
        });

        return _.flatten(result);
    },

    positionRowsAll: function (positions) {
        function sum(a, b) {
            return a + b;
        }

        return _.map(positions.groupBy("stock"), function (positions, stockSymbol) {
            var totalCost = _.reduce(_.map(positions, function (pos) {
                return pos.get("buyingPrice") * pos.get("quantity");
            }), sum);
            var totalQuantity = _.reduce(_.map(positions, function (pos) {return pos.get("quantity")}),
                                         sum);

            var marketPrice = 23000;
            var totalValue = marketPrice * totalQuantity;
            var gain = totalValue - totalCost;
            var roi = (gain / totalCost * 100).toFixed(2);

            return  (
                React.createElement("tr", null, 
                  React.createElement("td", null, stockSymbol), 
                  React.createElement("td", null, "HOSE"), 
                  React.createElement("td", null, totalQuantity), 
                  React.createElement("td", null, formatCurrency(totalCost / totalQuantity)), 
                  React.createElement("td", null, formatCurrency(23000)), 
                  React.createElement("td", null, formatCurrency(totalCost)), 
                  React.createElement("td", null, formatCurrency(totalValue)), 
                  React.createElement("td", null, React.createElement("span", {className: "text-success"}, roi, "%"))
                )
            );
        });
    },

    render: function() {
        // FIXME Stop using fake data
        if (this.state.viewType === "by-trader") {
            var positionRows = this.positionRowsByTrader(this.positions());
        } else {
            var positionRows = this.positionRowsAll(this.positions());
        }

        return (
            React.createElement("div", {className: "panel panel-default panel-tabbed"}, 
              React.createElement("div", {className: "panel-body"}, 
                React.createElement("select", {ref: "viewTypeSelector", 
                        value: this.state.viewType, 
                        onChange: this.changeViewType, 
                        style: {marginBottom: "1em"}}, 
                  React.createElement("option", {value: "all"}, "Toàn bộ"), 
                  React.createElement("option", {value: "by-trader"}, "Theo chiến lược gia")
                ), 

                React.createElement("table", {className: "table table-striped table-hover table-bordered"}, 
                  React.createElement("thead", null, 
                    React.createElement("tr", null, 
                      React.createElement("th", null, "Mã CK"), 
                      React.createElement("th", null, "Sàn"), 
                      React.createElement("th", null, "Khối lượng"), 
                      React.createElement("th", null, "Giá vốn"), 
                      React.createElement("th", null, "Giá thị trường"), 
                      React.createElement("th", null, "Tổng giá vốn"), 
                      React.createElement("th", null, "Tổng giá thị trường"), 
                      React.createElement("th", null, "Lợi nhuận")
                    )
                  ), 

                  React.createElement("tbody", null, 
                    positionRows
                  )
                )
              )
            )
        );
    }
});


var OverviewPanel = React.createClass({displayName: "OverviewPanel",
    componentDidMount: function() {
        var data = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: "My Second dataset",
                    fillColor: "rgba(255, 153, 0, 0.2)",
                    strokeColor: "rgba(255, 153, 0, 1)",
                    pointColor: "rgba(255, 153, 0, 1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(255, 153, 0, 1)",
                    data: [28, 48, 40, -22, 86, 27, 90]
                }
            ]
        };

        var ctx = this.refs.overviewChart.getDOMNode().getContext("2d");
        var chart = new Chart(ctx).Line(data, {
            responsive: true
        });
    },
    render: function () {
        var style = "\
        canvas {\
            width: 100%;\
        };";

        return (
            React.createElement("div", {className: "panel panel-default panel-overview panel-tabbed"}, 

                React.createElement("style", {scoped: true}, 
                style
                ), 

              React.createElement("div", {className: "panel-body"}, 
                React.createElement("div", {className: "info-pane"}, 
                  React.createElement("img", {src: "/static/img/avatar.png", alt: ""}), 
                  React.createElement("div", null, 
                    React.createElement("div", null, React.createElement("span", {className: "ui-label-strong"}, "TraderAAA")), 
                    React.createElement("div", {className: "second-line"}, 
                      React.createElement("div", null, 
                        React.createElement("span", {className: "ui-label-strong"}, "Lãi hiện tại: "), 
                          formatCurrency(23223423)
                      ), 
                      React.createElement("div", null, 
                        React.createElement("span", {className: "ui-label-strong"}, "Lãi thực tế: "), 
                        formatCurrency(23223423)
                      ), 
                      React.createElement("div", null, 
                        React.createElement("span", {className: "ui-label-strong"}, "ROI: "), 
                        "24%"
                      )
                    )
                  )
                ), 

                React.createElement("div", {ref: "graph", className: "panel-overview-graph"}, 
                  React.createElement("canvas", {ref: "overviewChart"})
                )
              )
            )
        );
    }
});
'use strict';


var RiskSlider = React.createClass({displayName: "RiskSlider",
    componentDidMount: function() {
        var slider = this.refs.riskSlider.getDOMNode();
        var _this = this;

        // FIXME: we are calling `me` directly
        var tmp = $(slider).noUiSlider({
            start: [ me.get("riskFactor") ],
            step: 10,
            connect: "lower",
            range: {
                'min': [0],
                'max': [100]
            }
        }).on("change", function() {
            if (_this.props.onChange) {
                _this.props.onChange($(slider).val());
            }
        });

        if (!this.props.withoutPips) {
            tmp.noUiSlider_pips({
                mode: "positions",
                stepped: true,
                values: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                densitiy: 4
            });
        }
    },
    render: function() {
        return (React.createElement("div", {ref: "riskSlider", style: this.props.style}));
    }
});

$(document).ready(function() {
    traders = new Traders();
    me = new Follower();
    me.url = "/api/v1/follower/" + user.id;
    me.fetch().then(function() {traders.fetch()}).then(function() {
        React.render(
            React.createElement(AccountScreen, null),
            document.getElementById('app')
        );
    });

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

//
// These models are the "stores" in Facebook's Flux architecture
//

var Traders = Backbone.Collection.extend({
    url: "/api/v1/traders",

    comparator: function(item) {
        return item.get('id');
    },

    parse: function(data) {
        return data.result;
    }
});

var FollowingRels = Backbone.Collection.extend({
    model: Backbone.Model.extend({
        idAttribute: "traderId"
    }),
    parse: function(data) {
        return data.result;
    }
});

var Follower = Backbone.Model.extend({

    defaults: {
        followingTraders: new FollowingRels(),
        positions: new Backbone.Collection(),
        firstLogin: true,
        riskFactor: 0
    },

    initialize: function() {
        var _this = this;

        // dispatcher.register(function(message) {
        //     switch (message.type) {
        //         case "ask_to_follow_trader":
        //             $.post("/api/v1/follower/" + _this.id + "/following", {
        //                 traderid: message.trader.id,
        //                 money: message.allocatedMoney,
        //                 maxopen: 3
        //             }).then(function() {
        //                 _this.fetch();
        //                 traders.fetch();
        //             });
        //             break;
        //         case "ask_to_unfollow_trader":
        //             $.ajax({
        //                 url: "/api/v1/follower/" + _this.id + "/following/" + message.trader.id,
        //                 method: "DELETE",
        //                 success: function() {
        //                     _this.fetch();
        //                     traders.fetch();
        //                 }
        //             });
        //             break;
        //     }
        // });

        // Setup the notification
        var socket = SockJS("/hello");
        var stompClient = Stomp.over(socket);
        var self = this;

        stompClient.connect({}, function (frame) {
            console.log(frame);
            stompClient.subscribe("/user/queue/executed-orders", function(msg) {
                console.log("Executed Order: ");
                self.get("positions").fetch();
            });
        });
    },

    parse: function(data) {
        var data = data.result;
        this.get("followingTraders").url = "/api/v1/follower/" + data.id + "/following";
        this.get("followingTraders").fetch();

        this.get("positions").url = "/api/v1/follower/" + data.id + "/positions";
        this.get("positions").fetch();
        return data;
    },

    isFollowing: function(trader) {
        return this.get("followingTraders").get(trader.get("id")) !== undefined;
    }
});
function formatCurrency(amount) {
    return amount.toLocaleString("vi", {
        style: "currency",
        currency: "VND",
    });
}

function formatAmount(amount) {
	return amount.toLocaleString("vi");
}

function formatPercent(amount) {
	return amount.toLocaleString("vi", {style: "percent"});
}
var WizardScreen = React.createClass({displayName: "WizardScreen",
    componentDidMount: function() {
    },

    btnFinishClicked: function() {
        var innerRiskSlider = this.refs.riskSlider.refs.riskSlider.getDOMNode();
        var riskFactor = parseInt($(innerRiskSlider).val());
        var selectedTrader = this.refs.traderSelector.selectedTrader();

        var allocatedMoneyNode = this.refs.allocatedMoney.getDOMNode();
        if (allocatedMoneyNode.value === "") {
            var allocatedMoney = allocatedMoneyNode.placeholder;
        } else {
            var allocatedMoney = allocatedMoneyNode.value;
        }

        var value = parseInt(allocatedMoney);
        if (value === NaN || value < 0) {
            alert("Số tiền phải là số dương!");
        }

        // FIXME riskFactor is not used yet
        // FIXME Handle the error case
        // dispatcher.dispatch({
        //     type: "ask_to_follow_trader",
        //     trader: selectedTrader,
        //     allocatedMoney: allocatedMoney
        // });

        me.set("riskFactor", riskFactor);
        me.save();

        this.props.onCompletion();
    },

    cancel: function() {
        this.props.onCompletion();
    },

    render: function() {
        var styles = {
            slider: {
                marginBottom: 60
            }
        };

        return (
          React.createElement("div", {className: "panel panel-default wizard"}, 
            React.createElement("div", {className: "panel-heading"}, 
              React.createElement("h2", {className: "panel-title"}, "Cài đặt Tài khoản của bạn")
            ), 

            React.createElement("div", {className: "panel-body"}, 
              React.createElement("div", {className: "step"}, 
                React.createElement("h3", null, "Bước 1: Đặt mức độ rủi ro bạn sẵn sàng chấp nhận"), 
                React.createElement(RiskSlider, {style: styles.slider, ref: "riskSlider"})
              ), 

              React.createElement("div", {className: "step"}, 
                React.createElement("h3", null, "Bước 2: Chọn chiến lược"), 
                React.createElement(TraderCarousel, {traders: traders, ref: "traderSelector"})
              ), 

              React.createElement("div", {className: "step"}, 
                React.createElement("h3", null, "Bước 3: Chọn số tiền đặt cho Nhà đầu tư bạn vừa chọn"), 
                React.createElement("input", {type: "number", min: "1", placeholder: "1", ref: "allocatedMoney"}), " triệu VND"
              ), 

              React.createElement("div", {className: "button-row clearfix"}, 
                React.createElement("button", {className: "btn btn-default", onClick: this.cancel}, "Bỏ qua"), 
                React.createElement("button", {className: "btn btn-primary", onClick: this.btnFinishClicked}, "Hoàn thành")
              )
                )
            )
        );
    }
});


// FIXME Using global `traders` object
var TraderCarousel = React.createClass({displayName: "TraderCarousel",
    getInitialState: function() {
        return {
            selectedTrader: traders.models[0],
            currentSlide: 0
        }
    },

    componentDidMount: function() {
        var thumb = this.refs.thumbSlider.getDOMNode();
        var detail = this.refs.detailSlider.getDOMNode();

        $(thumb).slick({
            asNavFor: $(detail),
            slidesToShow: 3,
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: '60px',
            focusOnSelect: true,
            nextArrow: this.refs.btnNext.getDOMNode(),
            prevArrow: this.refs.btnPrev.getDOMNode(),
        });

        $(detail).slick({
            asNavFor: $(thumb),
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
        });

        var _this = this;
        $(detail).on("afterChange", function(event, slick, currentSlide) {
            _this.setState({
                selectedTrader: traders.models[currentSlide],
                currentSlide: currentSlide
            });
        });
    },

    selectedTrader: function() {
        return this.state.selectedTrader;
    },

    render: function() {
        var traderNodes = traders.map(function(trader, index) {
            return React.createElement(TraderLine, {trader: trader, index: index + 1});
        });

        var buttonStyle = {
                position: 'absolute',
                top: 0,
                width: 30,
                height: '100%',
                backgroundColor: '#EEE',
                border: "none"
        };

        var styles = {
            next: _.extend({
                right: 0,
            }, buttonStyle),
            prev: _.extend({
                left: 0,
            }, buttonStyle),
            thumbSlider: {
                position: 'relative'
            },
            detail: {
                marginBottom: 20
            }
        };

        return (
            React.createElement("div", null, 
              React.createElement("div", {ref: "detailSlider", style: styles.detail}, 
                traderNodes
              ), 

              React.createElement("div", {style: styles.thumbSlider}, 
                React.createElement("div", {ref: "thumbSlider", className: "trader-thumb-slider"}, 
                  React.createElement("div", null, React.createElement("img", {className: "img-thumbnail", src: "/static/img/trader1.jpg"})), 
                  React.createElement("div", null, React.createElement("img", {className: "img-thumbnail", src: "/static/img/trader2.jpg"})), 
                  React.createElement("div", null, React.createElement("img", {className: "img-thumbnail", src: "/static/img/trader3.jpg"})), 
                  React.createElement("div", null, React.createElement("img", {className: "img-thumbnail", src: "/static/img/trader4.jpg"}))
                ), 

                React.createElement("button", {style: styles.next, ref: "btnNext"}, "▶"), 
                React.createElement("button", {style: styles.prev, ref: "btnPrev"}, "◀")
              )
            )
        );
    }
});


var TraderLine = React.createClass({displayName: "TraderLine",
    followBtnToggled: function() {
        // if (me.isFollowing(this.props.trader)) {
        //     dispatcher.dispatch({
        //         type: "ask_to_unfollow_trader",
        //         trader: this.props.trader
        //     });
        // } else {
        //     dispatcher.dispatch({
        //         type: "ask_to_follow_trader",
        //         trader: this.props.trader
        //     });
        // }
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

        var imgSrc = "/static/img/trader" + this.props.index + ".jpg";
        return (
            React.createElement("div", {className: "traderLine clearfix"}, 
              React.createElement("div", {className: "block"}, 
                React.createElement("img", {src: imgSrc, className: "img-thumbnail"})
              ), 

              React.createElement("div", {className: "block basic-info"}, 
                React.createElement("h2", null, this.props.trader.get("name")), 
                React.createElement("p", {className: "text-muted"}, 
                  this.props.trader.get("id"), 
                  this.props.trader.get("description")
                )
              ), 

              React.createElement("div", {className: "block"}, 
                React.createElement("span", {className: "text-label"}, "NAV"), React.createElement("br", null), 
                React.createElement("strong", {className: "text-success"}, this.props.trader.get("cash"), " VND"), React.createElement("br", null), 

                React.createElement("span", {className: "text-label"}, "Số người copy"), React.createElement("br", null), 
                React.createElement("strong", {className: "text-success"}, Math.floor(Math.random() * 1000)), React.createElement("br", null)
              ), 

              React.createElement("div", {className: "block"}, 
                React.createElement("span", {className: "text-label"}, "ROI"), React.createElement("br", null), 
                React.createElement("strong", {className: "text-success"}, (Math.random() * 100).toFixed(2), "%")
                /* <button type="submit"
                   className={followBtnClasses}
                   onClick={this.followBtnToggled}>{{followButtonText}}</button> */
              )
            )
        );
    }
});

