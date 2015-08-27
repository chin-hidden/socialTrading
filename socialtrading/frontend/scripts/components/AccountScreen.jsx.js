import React from "react";
import Chart from "chart";
import $ from "jquery";
import _ from "underscore";
import RiskSlider from "./RiskSlider.jsx";
import DISPATCHER from "../dispatcher";
import {stockStore} from "../models";
import {me, traders} from "../common";
import {formatCurrency, getMarketInfo, formatPercent, dealStatusName} from "../utils";


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
            <div>
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
                {/*<li className={active['solenh']}>
                  <a href="#" onClick={this.switchTab.bind(this, "solenh")}>
                    Sổ lệnh trong ngày
                  </a>
                </li>*/}
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
                      <span className="ui-label">lợi nhuận</span><br/>
                      <strong className="text-success">{formatCurrency(me.get("gross_profit"))}</strong>
                    </div>
                    <div className="col-md-3">
                      <span className="ui-label">tài sản</span><br/>
                      <strong className="text-success">{formatCurrency(me.get("nav"))}</strong>
                    </div>
                    <div className="col-md-3">
                      <span className="ui-label">chứng khoán</span><br/>
                      <strong className="text-success">{formatCurrency(me.get("gross_stock_value"))}</strong>
                    </div>
                    <div className="col-md-3">
                      <span className="ui-label">tiền mặt</span><br/>
                      <strong className="text-success">{formatCurrency(me.get("cash"))}</strong>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <span className="ui-label">tốc độ đầu tư:</span>
                      <RiskSlider ref="riskSlider" onChange={this.riskSliderChanged} config={riskSliderConfig}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        );
    }
});


var DealViewType = {
  ALL: "ALL",
  BY_TRADER: "BY_TRADER"
}

var PositionPanel = React.createClass({
    getInitialState: function() {
        return {};
    },

    componentDidMount: function() {
        me.get("deals").on("update change", () => {
            this.forceUpdate();
        });

        me.get("following_traders").on("update change", () => {
            this.forceUpdate();
        });

        DISPATCHER.on("stock:changed", () => {
            this.forceUpdate();
        });
    },

    changeViewType: function(event) {
        this.setState({viewType: event.target.value});
    },

    /**
     * Get position rows, grouped by traders.
     */
    positionRowsByTrader: function (deals) {
        var self = this;

        var posByTrader = deals.groupBy("mimicking_username");
        var result = _.map(posByTrader, (deals, traderAccount) => {
            var rowsForThisTrader = _.map(deals, (deal) => {
                var marketPrice = 0;
                if (deal.get("status") === "SELLING:Filled") {
                    marketPrice = deal.get("selling_price");
                } else {
                    marketPrice = stockStore.get(deal.get("symbol")).get("matchPrice");
                }

                var totalCost = deal.get("buying_price") * deal.get("quantity");
                var totalValue = marketPrice * deal.get("quantity");
                var gain = totalValue - totalCost;
                var roi = gain / totalCost;

                var roiClassNames = "text-success";
                if (roi < 0) {
                    roiClassNames = "text-danger";
                }

                return (
                    <tr key={deal.id}>
                      <td>{deal.get("symbol")}</td>
                      <td>HOSE</td>
                      <td>{deal.get("quantity")}</td>
                      <td>{formatCurrency(deal.get("buying_price"))}</td>
                      <td>{formatCurrency(marketPrice)}</td>
                      <td>{formatCurrency(totalCost)}</td>
                      <td>{formatCurrency(totalValue)}</td>
                      <td><span className={roiClassNames}>{formatPercent(roi)}</span></td>
                      <td>{dealStatusName(deal.get("status"))}</td>
                    </tr>
                );
            });

            var traderName = traders.get(traderAccount).get("name");

            // var rel = me.get("following_traders").get(me.id + traderAccount);
            var rel = me.get("following_traders").where({follower_id: me.id, trader_id: traderAccount})[0];

            var headerRow = (
                <tr key={traderName} style={{backgroundColor: "#cbffaf"}}>
                  <td colSpan="7">{traderName}</td>
                  <td>{formatCurrency(rel.get("profit"))} ({formatPercent(rel.get("roi"))})</td>
                  <td></td>
                </tr>
            );

            return _.union([headerRow], rowsForThisTrader);
        });

        return _.flatten(result);
    },

    render: function() {
        var deals = me.get("deals");

        if (deals.length === 0) {
          var positionRows = (
            <tr>
              <td colSpan="9">Các chiến lược gia của bạn chưa mua cổ phiếu nào. Xin vui lòng chờ thêm.</td>
            </tr>
          );
        } else {
            var positionRows = this.positionRowsByTrader(deals);
        }

        return (
            // FIXME: Redesign this deal listing view.
            <div className="panel panel-default panel-tabbed panel-deals">
              <div className="panel-body">

                <table className="table table-striped table-hover table-bordered" id="deal-listing">
                  <thead>
                    <tr>
                      <th>Mã CK</th>
                      <th>Sàn</th>
                      <th>Khối lượng</th>
                      <th>Giá vốn</th>
                      <th>Giá thị trường</th>
                      <th>Tổng giá vốn</th>
                      <th>Tổng giá thị trường</th>
                      <th>Lợi nhuận</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>

                  <tbody>
                    {positionRows}
                  </tbody>
                </table>
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

                    <button className="btn btn-primary btn-add-trader">Thêm chiến lược gia</button>
                </div>

                <div ref="graph" className="graph">
                  <canvas ref="overviewChart"></canvas>
                </div>
              </div>
            </div>
        );
    }
});
