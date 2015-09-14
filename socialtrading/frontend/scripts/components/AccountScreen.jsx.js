import React from "react";
import Chart from "chart";
import ImageLoader from 'react-imageloader';
import $ from "jquery";
import _ from "underscore";
import Backbone from "backbone";

import {formatCurrency, getMarketInfo, formatPercent, dealStatusName} from "../utils";
import RiskSlider from "./RiskSlider.jsx";
import Portfolio from "./Portfolio.jsx";
import DependencyInjectedMixin from "./DependencyInjectedMixin.jsx";
import * as app from "../app";


export var AccountScreen = React.createClass({
    mixins: [DependencyInjectedMixin],

    propTypes: {
        traders: React.PropTypes.object.isRequired,
        follower: React.PropTypes.object.isRequired,
    },

    getInitialState: function() {
        return {
            activeTab: "overview"
        };
    },

    componentDidMount: function() {
        this.props.follower.on("change", () => {
            this.forceUpdate();
        });
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
                tabContent = (<OverviewPanel/>);
                active["overview"] = "active";
                break;
            case "danhmuc":
                tabContent = (
                    <div className="panel panel-default panel-tabbed panel-deals">
                        <div className="panel-body">
                            <Portfolio/>
                        </div>
                    </div>
                );
                active["danhmuc"] = "active";
        }

        return (
            <div className="account-screen">
                <InfoBox/>

                <ul className="nav nav-tabs">
                    <li className={active['overview']}>
                        <a href="#"  onClick={this.switchTab.bind(this, "overview")}>
                            Kết quả đầu tư
                        </a>
                    </li>
                    <li className={active['danhmuc']}>
                        <a href="#" onClick={this.switchTab.bind(this, "danhmuc")}>
                            Danh mục đầu tư
                        </a>
                    </li>
                </ul>

                {tabContent}
            </div>
        );
    }
});


var InfoBox = React.createClass({
    mixins: [DependencyInjectedMixin],

    propTypes: {
        follower: React.PropTypes.object.isRequired
    },

    riskSliderChanged: function(value) {
        this.props.follower.set("risk_factor", Math.floor(value));
        this.props.follower.save(null, {
            success: () => {
                $.notify("Đã lưu");
            },
            error: (model, response, options) => {
                $.notify("Không thể lưu!", {
                    className: "error"
                });
            }
        });
    },

    render: function() {
        var follower = this.props.follower;

        var riskSliderConfig = {
            start: [ follower.get("risk_factor") ],
            connect: "lower",
            step: 1,
            range: {
                'min': [0],
                'max': [100]
            }
        };

        return (
            <div className="panel panel-default info-box">
              <div className="panel-body clearfix">
                <ImageLoader src={follower.getAvatar()} className="avatar"/>

                <div className="personal-info">
                    <div className="name">{follower.get("name")}</div>
                    <div className="username">{follower.get("id")}</div>
                    <span className="ui-label">TK:</span> {follower.get("account_number")}
                </div>

                <div className="accountStats">
                  <div className="row">
                    <div className="col-md-3">
                      <span className="ui-label">Lợi nhuận</span><br/>
                      <strong>{formatCurrency(follower.get("gross_profit"))}</strong>
                    </div>
                    <div className="col-md-3">
                      <span className="ui-label">Tài sản</span><br/>
                      <strong>{formatCurrency(follower.get("nav"))}</strong>
                    </div>
                    <div className="col-md-3">
                      <span className="ui-label">Chứng khoán</span><br/>
                      <strong>{formatCurrency(follower.get("gross_stock_value"))}</strong>
                    </div>
                    <div className="col-md-3">
                      <span className="ui-label">Tiền mặt</span><br/>
                      <strong>{formatCurrency(follower.get("cash"))}</strong>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <span className="ui-label">Tốc độ đầu tư:</span>
                      <RiskSlider ref="riskSlider" onChange={this.riskSliderChanged} config={riskSliderConfig}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        );
    }
});



var OverviewPanel = React.createClass({
    mixins: [DependencyInjectedMixin],

    propTypes: {
        follower: React.PropTypes.object.isRequired,
        traders: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
        var rels = this.props.follower.get("following_traders");

        return {
            selectedRel: rels.at(0)
        };
    },

    componentDidMount: function() {
        this.renderChart();
    },

    componentDidUpdate: function() {
        this.renderChart();
    },

    renderChart: function() {
        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        }

        var data = {
            labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7"],
            datasets: [
                {
                    label: "My Second dataset",
                    fillColor: "rgba(255, 153, 0, 0.0)",
                    strokeColor: "rgba(255, 153, 0, 1)",
                    pointColor: "rgba(255, 153, 0, 1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(255, 153, 0, 1)",
                    data: _.times(7, getRandomInt.bind(20, 90)),
                    animationSteps: 20,
                    scaleBeginAtZero: true,
                }
            ]
        };

        var ctx = this.refs.overviewChart.getDOMNode().getContext("2d");
        var chart = new Chart(ctx).Line(data, {
            responsive: true
        });
    },

    tabClicked: function(rel) {
        this.setState({
            selectedRel: rel
        });
    },

    render: function () {
        var follower = this.props.follower;
        var rels = follower.get("following_traders");

        var traderTabs = rels.map((rel) => {
            var trader = this.props.traders.get(rel.get("trader_id"));

            var tabClassNames = "trader-tab";
            if (rel === this.state.selectedRel) {
                tabClassNames += " active";
            }

            return (
                <div key={rel.cid} onClick={this.tabClicked.bind(null, rel)} className={tabClassNames}>
                    <div>
                        <ImageLoader className="avatar" src={trader.getAvatar()}/>
                    </div>

                    <div>
                      <div><span className="ui-label-strong">{trader.get("name")}</span></div>
                      <div className="second-line">
                        <div>
                          <span className="ui-label">Lãi: </span>
                          {formatCurrency(rel.get("profit"))}
                        </div>
                        <div>
                          <span className="ui-label">Tỉ lệ lãi: </span>
                          {formatPercent(rel.get("roi"))}
                        </div>
                      </div>
                    </div>
                </div>
            );
        });

        function goToTradersPage() {
            Backbone.history.navigate("traders", {trigger: true});
        };

        return (
            <div className="panel panel-default panel-overview panel-tabbed">
              <div className="panel-body">
                <div className="trader-listing">
                    <div className="tabs">
                        {traderTabs}
                    </div>

                    <button className="btn btn-primary btn-add-trader" onClick={goToTradersPage}>Thêm chiến lược gia</button>
                </div>

                <div ref="graph" className="graph">
                  <canvas ref="overviewChart"></canvas>
                </div>
              </div>
            </div>
        );
    }
});
