var AccountScreen = React.createClass({
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
                <li className={active['solenh']}>
                  <a href="#" onClick={this.switchTab.bind(this, "solenh")}>
                    Sổ lệnh trong ngày
                  </a>
                </li>
                <li className={active['lichsugd']}>
                  <a href="#" onClick={this.switchTab.bind(this, "lichsugd")}>
                    Lịch sử giao dịch
                  </a>
                </li>
              </ul>

              {tabContent}
            </div>
        );
    }
});


var InfoBox = React.createClass({
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
            <div className="panel panel-default">
              <div className="panel-body clearfix">
                <div ref="personalInfo" style={{float: "left", marginRight: spacing}}>
                  <img src="/static/img/avatar.png" style={{height: 120}}/>
                </div>

                <div ref="personalInfo" style={styles.personalInfo}>
                  <strong style={{fontSize: "1.5em"}}>{me.get("name")}</strong><br/>

                  <div>
                  {me.get("id")}<br/>
                  TK: {me.get("accountNumber")}
                  </div>
                </div>

                <div ref="accountInfo" style={styles.accountInfo}>
                  <div className="row" style={styles.accountInfoRow}>
                    <div className="col-md-3">
                      <span>Lợi nhuận</span><br/>
                      <strong className="text-success">{me.get("cash")} VND</strong>
                    </div>
                    <div className="col-md-3">
                      <span>Tài sản</span><br/>
                      <strong className="text-success">{me.get("cash")} VND</strong>
                    </div>
                    <div className="col-md-3">
                      <span>Chứng khoán</span><br/>
                      <strong className="text-success">{me.get("cash")} VND</strong>
                    </div>
                    <div className="col-md-3">
                      <span>Tiền mặt</span><br/>
                      <strong className="text-success">{me.get("cash")} VND</strong>
                    </div>
                  </div>

                  <div className="row" style={styles.accountInfoRow}>
                    <div className="col-md-12">
                      <h4>Tốc độ đầu tư:</h4>
                      <RiskSlider ref="riskSlider" 
                                  onChange={this.riskSliderChanged} 
                                  style={styles.riskSlider}
                                  withoutPips={true}/>
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
                    <tr>
                      <td>{pos.get("stock")}</td>
                      <td>HOSE</td>
                      <td>{pos.get("quantity")}</td>
                      <td>{formatCurrency(pos.get("buyingPrice"))}</td>
                      <td>{formatCurrency(marketPrice)}</td>
                      <td>{formatCurrency(totalCost)}</td>
                      <td>{formatCurrency(totalValue)}</td>
                      <td><span className="text-success">{roi}%</span></td>
                    </tr>
                );
            });

            var traderName = traders.get(traderAccount).get("name");

            var headerRow = (
                <tr style={{backgroundColor: "#cbffaf"}}>
                  <td colSpan="7">{traderName}</td>
                  <td>{formatCurrency(25628674)} (25%)</td>
                </tr>
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
                <tr>
                  <td>{stockSymbol}</td>
                  <td>HOSE</td>
                  <td>{totalQuantity}</td>
                  <td>{formatCurrency(totalCost / totalQuantity)}</td>
                  <td>{formatCurrency(23000)}</td>
                  <td>{formatCurrency(totalCost)}</td>
                  <td>{formatCurrency(totalValue)}</td>
                  <td><span className="text-success">{roi}%</span></td>
                </tr>
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
    render: function () {
        return (
            <div className="panel panel-default panel-overview panel-tabbed">
              <div className="panel-body">
                <div className="info-pane">
                  <img src="/static/img/avatar.png" alt=""/>
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
                  <img src="/static/img/chart.png"/>
                </div>
              </div>
            </div>
        );
    }
});
