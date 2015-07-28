define(["exports"], function (exports) {
    "use strict";

    var WizardScreen = React.createClass({
        displayName: "WizardScreen",

        componentDidMount: function componentDidMount() {},

        btnFinishClicked: function btnFinishClicked() {
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

        cancel: function cancel() {
            this.props.onCompletion();
        },

        render: function render() {
            var styles = {
                slider: {
                    marginBottom: 60
                }
            };

            return React.createElement(
                "div",
                { className: "panel panel-default wizard" },
                React.createElement(
                    "div",
                    { className: "panel-heading" },
                    React.createElement(
                        "h2",
                        { className: "panel-title" },
                        "Cài đặt Tài khoản của bạn"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "panel-body" },
                    React.createElement(
                        "div",
                        { className: "step" },
                        React.createElement(
                            "h3",
                            null,
                            "Bước 1: Đặt mức độ rủi ro bạn sẵn sàng chấp nhận"
                        ),
                        React.createElement(RiskSlider, { style: styles.slider, ref: "riskSlider" })
                    ),
                    React.createElement(
                        "div",
                        { className: "step" },
                        React.createElement(
                            "h3",
                            null,
                            "Bước 2: Chọn chiến lược"
                        ),
                        React.createElement(TraderCarousel, { traders: traders, ref: "traderSelector" })
                    ),
                    React.createElement(
                        "div",
                        { className: "step" },
                        React.createElement(
                            "h3",
                            null,
                            "Bước 3: Chọn số tiền đặt cho Nhà đầu tư bạn vừa chọn"
                        ),
                        React.createElement("input", { type: "number", min: "1", placeholder: "1", ref: "allocatedMoney" }),
                        " triệu VND"
                    ),
                    React.createElement(
                        "div",
                        { className: "button-row clearfix" },
                        React.createElement(
                            "button",
                            { className: "btn btn-default", onClick: this.cancel },
                            "Bỏ qua"
                        ),
                        React.createElement(
                            "button",
                            { className: "btn btn-primary", onClick: this.btnFinishClicked },
                            "Hoàn thành"
                        )
                    )
                )
            );
        }
    });

    // FIXME Using global `traders` object
    var TraderCarousel = React.createClass({
        displayName: "TraderCarousel",

        getInitialState: function getInitialState() {
            return {
                selectedTrader: traders.models[0],
                currentSlide: 0
            };
        },

        componentDidMount: function componentDidMount() {
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
                prevArrow: this.refs.btnPrev.getDOMNode()
            });

            $(detail).slick({
                asNavFor: $(thumb),
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false
            });

            var _this = this;
            $(detail).on("afterChange", function (event, slick, currentSlide) {
                _this.setState({
                    selectedTrader: traders.models[currentSlide],
                    currentSlide: currentSlide
                });
            });
        },

        selectedTrader: function selectedTrader() {
            return this.state.selectedTrader;
        },

        render: function render() {
            var traderNodes = traders.map(function (trader, index) {
                return React.createElement(TraderLine, { trader: trader, index: index + 1 });
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
                    right: 0
                }, buttonStyle),
                prev: _.extend({
                    left: 0
                }, buttonStyle),
                thumbSlider: {
                    position: 'relative'
                },
                detail: {
                    marginBottom: 20
                }
            };

            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { ref: "detailSlider", style: styles.detail },
                    traderNodes
                ),
                React.createElement(
                    "div",
                    { style: styles.thumbSlider },
                    React.createElement(
                        "div",
                        { ref: "thumbSlider", className: "trader-thumb-slider" },
                        React.createElement(
                            "div",
                            null,
                            React.createElement("img", { className: "img-thumbnail", src: "/static/img/trader1.jpg" })
                        ),
                        React.createElement(
                            "div",
                            null,
                            React.createElement("img", { className: "img-thumbnail", src: "/static/img/trader2.jpg" })
                        ),
                        React.createElement(
                            "div",
                            null,
                            React.createElement("img", { className: "img-thumbnail", src: "/static/img/trader3.jpg" })
                        ),
                        React.createElement(
                            "div",
                            null,
                            React.createElement("img", { className: "img-thumbnail", src: "/static/img/trader4.jpg" })
                        )
                    ),
                    React.createElement(
                        "button",
                        { style: styles.next, ref: "btnNext" },
                        "▶"
                    ),
                    React.createElement(
                        "button",
                        { style: styles.prev, ref: "btnPrev" },
                        "◀"
                    )
                )
            );
        }
    });

    var TraderLine = React.createClass({
        displayName: "TraderLine",

        followBtnToggled: function followBtnToggled() {
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

        render: function render() {
            var followBtnClasses = "btn ";
            if (me.isFollowing(this.props.trader)) {
                var followButtonText = "Unfollow";
                followBtnClasses += "btn-danger";
            } else {
                followButtonText = "Follow";
                followBtnClasses += "btn-primary";
            }

            var imgSrc = "/static/img/trader" + this.props.index + ".jpg";
            return React.createElement(
                "div",
                { className: "traderLine clearfix" },
                React.createElement(
                    "div",
                    { className: "block" },
                    React.createElement("img", { src: imgSrc, className: "img-thumbnail" })
                ),
                React.createElement(
                    "div",
                    { className: "block basic-info" },
                    React.createElement(
                        "h2",
                        null,
                        this.props.trader.get("name")
                    ),
                    React.createElement(
                        "p",
                        { className: "text-muted" },
                        this.props.trader.get("id"),
                        this.props.trader.get("description")
                    )
                ),
                React.createElement(
                    "div",
                    { className: "block" },
                    React.createElement(
                        "span",
                        { className: "text-label" },
                        "NAV"
                    ),
                    React.createElement("br", null),
                    React.createElement(
                        "strong",
                        { className: "text-success" },
                        this.props.trader.get("cash"),
                        " VND"
                    ),
                    React.createElement("br", null),
                    React.createElement(
                        "span",
                        { className: "text-label" },
                        "Số người copy"
                    ),
                    React.createElement("br", null),
                    React.createElement(
                        "strong",
                        { className: "text-success" },
                        Math.floor(Math.random() * 1000)
                    ),
                    React.createElement("br", null)
                ),
                React.createElement(
                    "div",
                    { className: "block" },
                    React.createElement(
                        "span",
                        { className: "text-label" },
                        "ROI"
                    ),
                    React.createElement("br", null),
                    React.createElement(
                        "strong",
                        { className: "text-success" },
                        (Math.random() * 100).toFixed(2),
                        "%"
                    )
                )
            );
        }
    });
});
/* <button type="submit"
  className={followBtnClasses}
  onClick={this.followBtnToggled}>{{followButtonText}}</button> */
//# sourceMappingURL=wizardScreen.js.map