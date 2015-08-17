"use strict";

import React from "react";
import _ from "underscore";
import $ from "jquery";
import slick from "kenwheeler/slick";
import "kenwheeler/slick/slick/slick.css!";
import {me, traders} from "./common";
import {formatCurrency, getMarketInfo, formatPercent} from "./utils";
import {RiskSlider, MoneySlider} from "./Slider";


export var WizardScreen = React.createClass({
    componentDidMount: function() {
    },

    btnFinishClicked: function() {
        var innerRiskSlider = this.refs.riskSlider.refs.slider.getDOMNode();
        var riskFactor = parseInt(innerRiskSlider.noUiSlider.get());
        var selectedTrader = this.refs.traderSelector.selectedTrader();

        // var allocatedMoneyNode = this.refs.allocatedMoney.getDOMNode();
        // if (allocatedMoneyNode.value === "") {
        //     var allocatedMoney = allocatedMoneyNode.placeholder;
        // } else {
        //     var allocatedMoney = allocatedMoneyNode.value;
        // }

        // var value = parseInt(allocatedMoney);
        // if (value === NaN || value < 0) {
        //     alert("Số tiền phải là số dương!");
        // }

        // FIXME riskFactor is not used yet
        // FIXME Handle the error case
        // dispatcher.dispatch({
        //     type: "ask_to_follow_trader",
        //     trader: selectedTrader,
        //     allocatedMoney: allocatedMoney
        // });

        me.set("risk_factor", riskFactor);
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

        var moneySliderConfig = {
            start: [ me.get("cash") / 2 ],
            step: 1000000,
            connect: "lower",
            range: {
                'min': [0],
                'max': [ me.get("cash") ]
            }
        };

        var riskSliderConfig = {
            start: [ me.get("risk_factor") ],
            step: 1,
            connect: "lower",
            range: {
                'min': [0],
                'max': [100]
            }
        };

        return (
          <div className="panel panel-vndirect wizard">
            <div className="panel-heading">
                <h2 className="panel-title"> 
                Xin chào {me.get('name')}. Trước hết bạn cần thiết lập tài khoản của mình.
                </h2>
            </div>

            <div className="panel-body">
              <div className="step">
                <h3>Bước 1: Đặt khoản tiền đầu tư của bạn tại Autotrade:</h3>

                <p>Số tiền tối đa có thể đặt: {formatCurrency(me.get("cash"))}</p>

                <MoneySlider config={moneySliderConfig}/>
              </div>

              <div className="step">
                <h3>Bước 2: Lựa chọn chiến lược gia bạn muốn sao chép:</h3>
                <TraderCarousel traders={traders} ref="traderSelector"/>
              </div>

              <div className="step">
                <h3>Bước 3: Đặt mức độ rủi ro bạn sẵn sàng chấp nhận:</h3>
                <RiskSlider ref="riskSlider" config={riskSliderConfig}/>
                <p>
                Mức độ rủi ro được sử dụng để tính lại mức giá giao dịch của mỗi tín hiệu từ Chiến lược gia bạn đang theo dõi. Với mức rủi ro 50%, tài khoản của bạn sẽ đặt lệnh tại mức giá gần ngang bằng giá đặt lệnh của Chiến lược gia. 
                </p>
                <p><strong>Lưu ý:</strong> Mức độ rủi ro cao có thể mang lại cho bạn khoản lãi lớn hơn nhưng nguy cơ lỗ cũng cao hơn.</p>
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
        var thumb = this.refs.thumbSlider;
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
            backgroundColor: '#DDD',
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
            <div className="trader-line">
              <div className="trader-avatar">
                <img src={imgSrc} className="img-thumbnail"/>
              </div>

              <div style={{}}>
                  <p style={{fontWeight: "bold", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"}}>{this.props.trader.get("name")}</p>

                  <span className="text-label">NAV: </span>
                  <strong className="text-success">{formatCurrency(this.props.trader.get("nav"))}</strong><br/>

                  <span className="text-label">Số người theo dõi: </span>
                  <strong className="text-success">{this.props.trader.get("people_following")}</strong><br/>

                  <span className="text-label">Lãi dự kiến: </span>
                  <strong className="text-success">{formatPercent(this.props.trader.get('roi') / 100)}</strong>
              </div>
            </div>
        );
    }
});

