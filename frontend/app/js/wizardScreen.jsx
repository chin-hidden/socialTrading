
var WizardScreen = React.createClass({
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
        dispatcher.dispatch({
            type: "ask_to_follow_trader",
            trader: selectedTrader,
            allocatedMoney: allocatedMoney
        });

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
          <div className="panel panel-default wizard">
            <div className="panel-heading">
              <h2 className="panel-title">Cài đặt Tài khoản của bạn</h2>
            </div>

            <div className="panel-body">
              <div className="step">
                <h3>Bước 1: Đặt mức độ rủi ro bạn sẵn sàng chấp nhận</h3>
                <RiskSlider style={styles.slider} ref="riskSlider"/>
              </div>

              <div className="step">
                <h3>Bước 2: Chọn chiến lược</h3>
                <TraderCarousel traders={traders} ref="traderSelector"/>
              </div>

              <div className="step">
                <h3>Bước 3: Chọn số tiền đặt cho Nhà đầu tư bạn vừa chọn</h3>
                <input type="number" min="1" placeholder="1" ref="allocatedMoney"/> triệu VND
              </div>

              <div className="button-row clearfix">
                <button className="btn btn-default" onClick={this.cancel}>Bỏ qua</button>
                <button className="btn btn-primary" onClick={this.btnFinishClicked}>Hoàn thành</button>
              </div>
                </div>
            </div>
        );
    }
});


// FIXME Using global `traders` object
var TraderCarousel = React.createClass({
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
            return <TraderLine trader={trader} index={index + 1} />;
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
            <div>
              <div ref="detailSlider" style={styles.detail}>
                {traderNodes}
              </div>

              <div style={styles.thumbSlider}>
                <div ref="thumbSlider" className="trader-thumb-slider">
                  <div><img className="img-thumbnail" src="/static/img/trader1.jpg"/></div>
                  <div><img className="img-thumbnail" src="/static/img/trader2.jpg"/></div>
                  <div><img className="img-thumbnail" src="/static/img/trader3.jpg"/></div>
                  <div><img className="img-thumbnail" src="/static/img/trader4.jpg"/></div>
                </div>

                <button style={styles.next} ref="btnNext">&#9654;</button>
                <button style={styles.prev} ref="btnPrev">&#9664;</button>
              </div>
            </div>
        );
    }
});


var TraderLine = React.createClass({
    followBtnToggled: function() {
        if (me.isFollowing(this.props.trader)) {
            dispatcher.dispatch({
                type: "ask_to_unfollow_trader",
                trader: this.props.trader
            });
        } else {
            dispatcher.dispatch({
                type: "ask_to_follow_trader",
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

        var imgSrc = "/static/img/trader" + this.props.index + ".jpg";
        return (
            <div className="traderLine clearfix">
              <div className="block">
                <img src={imgSrc} className="img-thumbnail"/>
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
                <strong className="text-success">{this.props.trader.get("cash")} VND</strong><br/>

                <span className="text-label">Số người copy</span><br/>
                <strong className="text-success">{Math.floor(Math.random() * 1000)}</strong><br/>

              </div>

              <div className="block">
                <span className="text-label">ROI</span><br/>
                <strong className="text-success">{(Math.random() * 100).toFixed(2)}%</strong>
                {/* <button type="submit"
                   className={followBtnClasses}
                   onClick={this.followBtnToggled}>{{followButtonText}}</button> */}
              </div>
            </div>
        );
    }
});

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
                <img src="/static/img/trader1.jpg" className="img-thumbnail"/>
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
