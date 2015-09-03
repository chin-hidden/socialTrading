import React from "react";
import Chart from "chart";
import $ from "jquery";
import _ from "underscore";

import {formatCurrency, getMarketInfo, formatPercent, dealStatusName} from "../utils";
import DISPATCHER from "../dispatcher";
import {stockStore} from "../models";
import {me, traders} from "../common";
import RiskSlider from "./RiskSlider.jsx";
import Portfolio from "./Portfolio.jsx";


export var AccountScreen = React.createClass({
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
                tabContent = (<OverviewPanel/>);
                active["overview"] = "active";
                break;
            case "danhmuc":
                tabContent = (<PositionPanel/>);
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
    componentDidMount: function() {
        me.on("change", () => {
            this.forceUpdate();
        });
    },

    riskSliderChanged: function(value) {
        me.set("risk_factor", Math.floor(value));
        me.save(null, {
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
            label: {
                marginRight: "1em"
            },
        };

        var riskSliderConfig = {
            start: [ me.get("risk_factor") ],
            connect: "lower",
            step: 1,
            range: {
                'min': [0],
                'max': [100]
            }
        };

        return (
            <div className="panel panel-default">
              <div className="panel-body clearfix">
                <div ref="personalInfo" style={{float: "left", marginRight: spacing}}>
                <img src={me.getAvatar()} style={{height: 120}} className="img-thumbnail"/>
                </div>

                <div ref="personalInfo" style={styles.personalInfo}>
                  <strong style={{fontSize: "1.5em"}}>{me.get("name")}</strong><br/>

                  <div>
                  {me.get("id")}<br/>
                  <span className="ui-label">TK:</span> {me.get("account_number")}
                  </div>
                </div>

                <div ref="accountInfo" style={styles.accountInfo} id="accountInfo">
                  <div className="row">
                    <div className="col-md-3">
                      <span className="ui-label">Lợi nhuận</span><br/>
                      <strong className="text-success">{formatCurrency(me.get("gross_profit"))}</strong>
                    </div>
                    <div className="col-md-3">
                      <span className="ui-label">Tài sản</span><br/>
                      <strong className="text-success">{formatCurrency(me.get("nav"))}</strong>
                    </div>
                    <div className="col-md-3">
                      <span className="ui-label">Chứng khoán</span><br/>
                      <strong className="text-success">{formatCurrency(me.get("gross_stock_value"))}</strong>
                    </div>
                    <div className="col-md-3">
                      <span className="ui-label">Tiền mặt</span><br/>
                      <strong className="text-success">{formatCurrency(me.get("cash"))}</strong>
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


var PositionPanel = React.createClass({
    render: function() {
        return (
            <div className="panel panel-default panel-tabbed panel-deals">
                <div className="panel-body">
                    <Portfolio follower={me}/>
                </div>
            </div>
        );
    }
});


var OverviewPanel = React.createClass({
    componentDidMount: function() {
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
                    data: [28, 48, 40, 30, 86, 60, 90]
                }
            ]
        };

        var ctx = this.refs.overviewChart.getDOMNode().getContext("2d");
        var chart = new Chart(ctx).Line(data, {
            responsive: true
        });
    },
    render: function () {
        var rels = me.get("following_traders");

        var traderTabs = rels.map((rel) => {
            var trader = traders.get(rel.get("trader_id"));

            return (
                <div className="trader-tab clearfix">
                    <div className="avatar">
                        <img src={trader.getAvatar()} className="img-thumbnail"/>
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


        return (
            <div className="panel panel-default panel-overview panel-tabbed">
              <div className="panel-body">
                <div className="trader-listing">
                    {traderTabs}

                    <a className="btn btn-primary btn-add-trader" href="/traders">Thêm chiến lược gia</a>
                </div>

                <div ref="graph" className="graph">
                  <canvas ref="overviewChart"></canvas>
                </div>
              </div>
            </div>
        );
    }
});
