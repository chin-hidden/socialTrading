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
              <ul className="nav nav-tabs">
                <li className={active['overview']}>
                  <a href="#"  onClick={this.switchTab.bind(this, "overview")}>
                    <span className="glyphicon glyphicon-user" aria-hidden="true"></span>
                  </a>
                </li>
                <li className={active['danhmuc']}>
                  <a href="#" onClick={this.switchTab.bind(this, "danhmuc")}>
                    <span className="glyphicon glyphicon-briefcase" aria-hidden="true"></span>
                  </a>
                </li>
              </ul>

              <InfoBox/>
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
        var styles = {
            personalInfo: {
                float: "left",
                marginRight: 20,
                textAlign: "center"
            },
            accountInfo: {
                overflow: "hidden",
                fontSize: "16px"
            },
            accountInfoRow: {
                marginBottom: "1em"
            },
            riskSlider: {
                marginBottom: 30,
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
                <div ref="personalInfo" style={styles.personalInfo}>
                  <img src="/img/avatar.png"/>
                  <strong>Superman</strong><br/>
                  {me.id}
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
                      <RiskSlider ref="riskSlider" onChange={this.riskSliderChanged} style={styles.riskSlider}/>
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
                cost: 8500,
                mimickingAccountNumber: "0001052458"
            }),
            new Backbone.Model({
                stock: "VND",
                quantity: 5000,
                cost: 8300,
                mimickingAccountNumber: "0001011079"
            }),
            new Backbone.Model({
                stock: "ACB",
                quantity: 8000,
                cost: 12000,
                mimickingAccountNumber: "0001052458"
            }),
        ]);
    },

    changeViewType: function(event) {
        this.setState({viewType: event.target.value});
    },

    positionRowsByTrader: function (positions) {
        var posByTrader = positions.groupBy("mimickingAccountNumber");
        var result = _.map(posByTrader, function (positions, traderAccount) {
            var rowsForThisTrader = _.map(positions, function (pos) {
                return (
                    <tr>
                      <td>{pos.get("stock")}</td>
                      <td>{pos.get("quantity")}</td>
                      <td>{formatVNCurrency(pos.get("cost"))}</td>
                      <td>{formatVNCurrency(23000)}</td>
                      <td><span className="text-success">100%</span></td>
                    </tr>
                );
            });

            var traderName = traders.get(traderAccount).get("name");

            var headerRow = (
                <tr>
                  <td colSpan="4">{traderName}</td>
                  <td>{formatVNCurrency(25628674)} (25%)</td>
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
                return pos.get("cost") * pos.get("quantity");
            }), sum);
            var totalQuantity = _.reduce(_.map(positions, function (pos) {return pos.get("quantity")}),
                                         sum);

            return  (
                <tr>
                  <td>{stockSymbol}</td>
                  <td>{totalQuantity}</td>
                  <td>{formatVNCurrency(totalCost / totalQuantity)}</td>
                  <td>{formatVNCurrency(23000)}</td>
                  <td><span className="text-success">100%</span></td>
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
            <div className="panel panel-default">
              <div className="panel-heading">
                <span>Danh muc cua toi</span>

                <select ref="viewTypeSelector"
                        value={this.state.viewType}
                        onChange={this.changeViewType}>
                  <option value="all">Toan bo</option>
                  <option value="by-trader">Chien luoc gia</option>
                </select>
              </div>

              <div className="panel-body">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Mã CK</th>
                      <th>Số lượng</th>
                      <th>Giá vốn</th>
                      <th>Giá hiện tại</th>
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
            <div className="panel panel-default panel-overview">
              <div className="panel-body">
                <div className="panel-overview-tabs">
                  <ul className="list-unstyled">
                    <li>
                      Loi nhuan
                      25.628.674 (25%)
                    </li>

                    <li>
                      <img src="/img/avatar.png"/>

                      Captain A.
                                            25.628.674

                      <button>Dung theo doi</button>
                      <button>Ban danh muc</button>
                    </li>
                  </ul>
                  <button className="btn btn-primary">Thay đổi chiến lược gia</button>
                </div>

                <div ref="graph" className="panel-overview-graph">
                  <img src="/img/overview-graph.png"/>
                </div>
              </div>
            </div>
        );
    }
});
