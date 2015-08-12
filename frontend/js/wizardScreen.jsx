import RiskSlider from "RiskSlider";
import {me, traders} from "common";
import {formatCurrency, getMarketInfo, formatPercent} from "utils";


export var WizardScreen = React.createClass({
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

        this.returnToAccountScreen();
    },

    cancel: function() {
        this.returnToAccountScreen();
    },

    returnToAccountScreen: function() {
        window.location.replace("/account");
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
              <h2 className="panel-title">Cài đặt Tài khoản</h2>
            </div>

            <div className="panel-body">
              <div className="step">
                <h3>Bước 1: Chọn số tiền bạn muốn dùng để đầu tư</h3>
                <input type="number" min="1" placeholder="1" ref="allocatedMoney"/> triệu VND
              </div>

              <div className="step">
                <h3>Bước 2: Chọn chiến lược</h3>
                <TraderCarousel traders={traders} ref="traderSelector"/>
              </div>

              <div className="step">
                <h3>Bước 3: Đặt mức độ rủi ro bạn sẵn sàng chấp nhận</h3>
                <RiskSlider style={styles.slider} ref="riskSlider"/>
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
        var _this = this;
        var thumb = this.refs.thumbSlider.getDOMNode();
        // var detail = this.refs.detailSlider.getDOMNode();

        $(thumb).slick({
            // asNavFor: $(detail),
            slidesToShow: 3,
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: '60px',
            focusOnSelect: true,
            nextArrow: this.refs.btnNext.getDOMNode(),
            prevArrow: this.refs.btnPrev.getDOMNode(),
        });

        // $(detail).on("afterChange", function(event, slick, currentSlide) {
        //     _this.setState({
        //         selectedTrader: traders.models[currentSlide],
        //         currentSlide: currentSlide
        //     });
        // });
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
                backgroundColor: '#BBB',
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
              <div style={styles.thumbSlider}>
                <div ref="thumbSlider" className="trader-thumb-slider">
                  {traderNodes}
                </div>

                <button style={styles.next} ref="btnNext">&#9654;</button>
                <button style={styles.prev} ref="btnPrev">&#9664;</button>
              </div>
            </div>
        );
    }
});


var TraderLine = React.createClass({
    render: function() {
        var followBtnClasses = "btn ";
        if (me.isFollowing(this.props.trader)) {
            var followButtonText = "Unfollow";
            followBtnClasses += "btn-danger";
        } else {
            followButtonText = "Follow";
            followBtnClasses += "btn-primary";
        }

        var imgSrc = "/static/img/trader1.jpg";
        return (
            <div className="traderLine">
              <img src={imgSrc} className="img-thumbnail"/>

              <p style={{fontWeight: "bold"}}>{this.props.trader.get("name")}</p>

              <span className="text-label">NAV</span><br/>
              <strong className="text-success">{formatCurrency(this.props.trader.get("cash"))}</strong><br/>

              <span className="text-label">Số người copy</span><br/>
              <strong className="text-success">{this.props.trader.get("people_following")}</strong><br/>
              <span className="text-label">ROI</span><br/>
              <strong className="text-success">{formatPercent(this.props.trader.get('roi') / 100)}</strong>
            </div>
        );
    }
});

