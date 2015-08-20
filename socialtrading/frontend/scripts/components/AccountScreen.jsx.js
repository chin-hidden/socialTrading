import React from "react";
import Chart from "chart";
import _ from "underscore";
import {me, traders} from "../common";
import {formatCurrency, getMarketInfo, formatPercent} from "../utils";
import RiskSlider from "./RiskSlider.jsx";


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
                    Tổng quan
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

                <div ref="accountInfo" style={styles.accountInfo}>
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
    getInitialState: function() {
        return {
            viewType: "all",
            marketPrices: {
              "VND": 1234,
              "ACB": 3453
            },
        };
    },

    reloadPrices: function() {
        _.map(deals.groupBy("symbol"), function (deals, stockSymbol) {});
    },

    componentDidMount: function() {
        me.get("deals").on("update", () => {
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
        var result = _.map(posByTrader, function (deals, traderAccount) {
            var rowsForThisTrader = _.map(deals, function (deal) {
                var marketPrice = 23000; // self.state.marketPrices[deal.get("symbol")];
                var totalCost = deal.get("buying_price") * deal.get("quantity");
                var totalValue = marketPrice * deal.get("quantity");
                var gain = totalValue - totalCost;
                var roi = (gain / totalCost * 100).toFixed(2);
                return (
                    <tr key={deal.id}>
                      <td>{deal.get("symbol")}</td>
                      <td>HOSE</td>
                      <td>{deal.get("quantity")}</td>
                      <td>{formatCurrency(deal.get("buying_price"))}</td>
                      <td>{formatCurrency(marketPrice)}</td>
                      <td>{formatCurrency(totalCost)}</td>
                      <td>{formatCurrency(totalValue)}</td>
                      <td><span className="text-success">{formatPercent(roi)}</span></td>
                    </tr>
                );
            });

            var traderName = traders.get(traderAccount).get("name");

            var headerRow = (
                <tr key={traderName} style={{backgroundColor: "#cbffaf"}}>
                  <td colSpan="7">{traderName}</td>
                  <td>{formatCurrency(25628674)} (25%)</td>
                </tr>
            );

            return _.union([headerRow], rowsForThisTrader);
        });

        return _.flatten(result);
    },

    /**
     * Get position rows, lumped together by stock symbol.
     */
    positionRowsAll: function (deals) {
        var self = this;

        function add(a, b) {
            return a + b;
        }

        return _.map(deals.groupBy("symbol"), function (deals, stockSymbol) {
            var totalCost = _.reduce(_.map(deals, function (deal) {
                return deal.get("buying_price") * deal.get("quantity");
            }), add);
            var totalQuantity = _.reduce(_.map(deals, function (deal) {return deal.get("quantity")}),
                                         add);

            var marketPrice = 23000; // self.state.marketPrices[stockSymbol];
            var totalValue = marketPrice * totalQuantity;
            var gain = totalValue - totalCost;
            var roi = (gain / totalCost * 100).toFixed(2);

            // We assume that the merged deals share the same exchange.
            var exchange = deals[0].get('exchange');

            return  (
                <tr key={stockSymbol}>
                  <td>{stockSymbol}</td>
                  <td>{exchange}</td>
                  <td>{totalQuantity}</td>
                  <td>{formatCurrency(totalCost / totalQuantity)}</td>
                  <td>{formatCurrency(marketPrice)}</td>
                  <td>{formatCurrency(totalCost)}</td>
                  <td>{formatCurrency(totalValue)}</td>
                  <td><span className="text-success">{formatPercent(roi)}</span></td>
                </tr>
            );
        });
    },

    render: function() {
        var deals = me.get("deals");
        if (this.state.viewType === "by-trader") {
            var positionRows = this.positionRowsByTrader(deals);
        } else {
            var positionRows = this.positionRowsAll(deals);
        }

        return (
            <div className="panel panel-default panel-tabbed">
              <div className="panel-body">
                <select ref="viewTypeSelector"
                        value={this.state.viewType}
                        onChange={this.changeViewType}
                        style={{marginBottom: "1em"}}>
                  <option value="all">Toàn bộ</option>
                  <option value="by-trader">Theo chiến lược gia</option>
                </select>

                <table className="table table-striped table-hover table-bordered">
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

        var ctx = this.refs.overviewChart.getContext("2d");
        var chart = new Chart(ctx).Line(data, {
            responsive: true
        });
    },
    render: function () {
        return (
            <div className="panel panel-default panel-overview panel-tabbed">
              <div className="panel-body">
                <div className="info-pane">
                <img src={me.getAvatar()} className="img-thumbnail"/>
                  <div>
                    <div><span className="ui-label-strong">TraderAAA</span></div>
                    <div className="second-line">
                      <div>
                        <span className="ui-label-strong">Lãi hiện tại: </span>
                          {formatCurrency(23223423)}
                      </div>
                      <div>
                        <span className="ui-label-strong">Lãi thực tế: </span>
                        {formatCurrency(23223423)}
                      </div>
                      <div>
                        <span className="ui-label-strong">ROI: </span>
                        24%
                      </div>
                    </div>
                  </div>
                </div>

                <div ref="graph" className="panel-overview-graph">
                  <canvas ref="overviewChart"></canvas>
                </div>
              </div>
            </div>
        );
    }
});
