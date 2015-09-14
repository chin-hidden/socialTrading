"use strict";

import React from "react";
import * as BS from "react-bootstrap";
import _ from "underscore";
import Carousel from 'nuka-carousel';

import RiskSlider from "./RiskSlider.jsx";
import MoneySlider from "./MoneySlider.jsx";
import {formatCurrency, getMarketInfo, formatPercent} from "../utils";


var Wizard = React.createClass({
    propTypes: {
        follower: React.PropTypes.object.isRequired,
    },

    componentDidMount: function() {
    },

    confirm: function() {
        var follower = this.props.follower;

        var innerRiskSlider = this.refs.riskSlider.refs.slider.getDOMNode();
        var riskFactor = parseInt(innerRiskSlider.noUiSlider.get());
        var selectedTraders = this.refs.traderSelector.selectedTraders();

        follower.set("risk_factor", riskFactor);
        var followings = follower.get("following_traders");

        // FIXME: Wrap all these in an async operation.
        selectedTraders.forEach((trader) => {
            followings.create({
                "follower_id": follower.id,
                "trader_id": trader.id
            });
        });

        follower.save().then(this.props.onHide);
    },

    render: function() {
        var follower = this.props.follower;

        var styles = {
            slider: {
                marginBottom: 60
            }
        };

        var moneySliderConfig = {
            start: [ follower.get("cash") / 2 ],
            step: 1000000,
            connect: "lower",
            range: {
                'min': [0],
                'max': [ follower.get("cash") ]
            }
        };

        var riskSliderConfig = {
            start: [ follower.get("risk_factor") ],
            step: 1,
            connect: "lower",
            range: {
                'min': [0],
                'max': [100]
            }
        };

        var Modal = BS.Modal,
            Button = BS.Button;
        return (
            <Modal className="wizard" {...this.props}>
              <Modal.Header closeButton>
                <Modal.Title>Xin chào {this.props.follower.get("name")}</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <p>Trước hết bạn cần thiết lập tài khoản của mình.</p>

                <div className="step">
                    <h3>Bước 1: Khoản tiền đầu tư của bạn tại Autotrade:</h3>
                    <p>Số tiền tối đa có thể đặt: {formatCurrency(follower.get("cash"))}</p>
                    <MoneySlider config={moneySliderConfig}/>
                </div>

                <div className="step">
                    <h3>Bước 2: Bạn muốn Nhà đầu tư nào giúp bạn kiếm lời? </h3>
                    <TraderCarousel traders={this.props.traders} ref="traderSelector"/>
                </div>

                <div className="step">
                    <h3>Bước 3: Tốc độ đầu tư của bạn:</h3>
                    <RiskSlider ref="riskSlider" config={riskSliderConfig}/>
                    <p>
                       <small>
                        Bạn mong muốn đồng hành cùng các nhà đầu tư ở tốc độ nhanh hay
                        chậm? Tốc độ càng nhanh thì khả năng lãi của bạn càng lớn hơn
                        nhưng độ rủi ro cho khoản đầu tư của bạn cũng cao hơn.
                        {" "}<strong>Autotrade</strong> sẽ dựa trên tốc độ đầu tư đó để xác
                        định lại mức giá giao dịch của mỗi tín hiệu từ nhà đầu tư bạn
                        đang theo dõi. Với tốc độ 50, tài khoản của bạn sẽ được đặt
                        các lệnh có giá ngang bằng với giá đặt của Nhà đầu tư.

                        {" "} <a href="/help">Tìm hiểu thêm.</a>
                       </small>
                    </p>

                </div>
              </Modal.Body>

              <Modal.Footer>
                <BS.ButtonToolbar>
                    <Button onClick={this.props.onHide}>Bỏ qua</Button>
                    <Button bsStyle='primary' onClick={this.confirm}>Đồng ý</Button>
                </BS.ButtonToolbar>
              </Modal.Footer>
            </Modal>
        );
    }
});


// FIXME Using global `traders` object
var TraderCarousel = React.createClass({
    propTypes: {
        traders: React.PropTypes.object.isRequired
    },

    mixins: [Carousel.ControllerMixin],

    getInitialState: function() {
        return {
            selectedTraders: [],
            currentSlide: 0
        };
    },

    componentDidMount: function() {
    },

    selectedTraders: function() {
        return this.state.selectedTraders;
    },

    traderSelected: function(trader, event) {
        var traders = this.state.selectedTraders;
        if (event.target.checked) {
            traders.push(trader);
        } else {
            var index = traders.indexOf(trader);
            traders.splice(index, 1);
        }

        console.log(traders, event);
    },

    render: function() {
        var traderNodes = this.props.traders.map((trader, index) => {
            return <TraderLine key={trader.id}
                               onSelected={this.traderSelected.bind(null, trader)}
                               trader={trader}
                               index={index + 1} />;
        });

        return (
            <Carousel slidesToShow={2} cellSpacing={20}>
                {traderNodes}
            </Carousel>
        );
    }
});


var TraderLine = React.createClass({
    propTypes: {
        onSelected: React.PropTypes.func
    },

    getInitialState: function() {
        return {
            selected: false
        };
    },

    onSelected: function(event) {
        this.setState({selected: event.target.checked});
        this.props.onSelected(event);
    },

    render: function() {
        var actionRowClasses = "row-action";
        if (this.state.selected) {
            actionRowClasses += " checked";
        }

        return (
            <div className="trader-line">
                <div className="row-info">
                  <div className="avatar">
                    <img src={this.props.trader.getAvatar()} className="img-thumbnail"/>
                  </div>

                  <div>
                      <p style={{fontWeight: "bold", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"}}>{this.props.trader.get("name")}</p>

                      <span className="text-label">Số tiền đầu tư: </span>
                      <strong className="text-success">{formatCurrency(this.props.trader.get("total_allocated_money"))}</strong><br/>

                      <span className="text-label">Số người theo dõi: </span>
                      <strong className="text-success">{this.props.trader.get("people_following")}</strong><br/>

                      <span className="text-label">Lãi dự kiến: </span>
                      <strong className="text-success">{formatPercent(this.props.trader.get('roi'))}</strong><br/>

                  </div>
                </div>

                <div className={actionRowClasses}>
                    <label><input type="checkbox" onChange={this.onSelected}/> Lựa chọn chiến lược này</label>
                </div>
            </div>
        );
    }
});


export default Wizard;
