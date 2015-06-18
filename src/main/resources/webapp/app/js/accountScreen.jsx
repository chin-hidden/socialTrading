var AccountScreen = React.createClass({
    render: function() {
        return (
            <div>
            <InfoBox/>
            <StockList/>
            </div>
        );
    }
});


var InfoBox = React.createClass({
    riskSliderChanged: function(value) {
        me.set("riskfactor", Math.floor(value));
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
                        <div className="col-md-6">
                            <span className="highlight-label" style={styles.label}>NAV</span>
                            <strong className="text-success">{me.get("cash")} VND</strong>
                        </div>
                        <div className="col-md-6">
                            <span className="highlight-label" style={styles.label}>Tổng lãi / lỗ</span>
                            <strong className="text-success">1345400 VND</strong>
                        </div>
                    </div>

                    <div className="row" style={styles.accountInfoRow}>
                        <div className="col-md-12">
                            <h4>Mức độ rủi ro:</h4>
                            <RiskSlider ref="riskSlider" onChange={this.riskSliderChanged} style={styles.riskSlider}/>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        );
    }
});


var StockList = React.createClass({
    componentDidMount: function() {
        var _this = this;
        var socket = new WebSocket("ws://localhost:8090/stocks");
        socket.onopen = function(event) {
            console.log("websocket connected");
        }
        socket.onmessage = this.newMessage;
    },

    newMessage: function() {
        console.log("new message");
    },

    render: function() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Danh mục của tôi</h3>
                </div>

                <div className="panel-body">
                    <table className="table table-striped table-hover">
                      <tr>
                        <th>Mã CK</th>
                        <th>Số lượng</th>
                        <th>Giá vốn</th>
                        <th>Giá hiện tại</th>
                        <th>%</th>
                      </tr>

                      <tr>
                        <td>FLC</td>
                        <td>100.000</td>
                        <td>11,800</td>
                        <td>23,600</td>
                        <td><span className="text-success">100%</span></td>
                      </tr>

                      <tr>
                        <td>VND</td>
                        <td>240.000</td>
                        <td>6,000</td>
                        <td>66,000</td>
                        <td><span className="text-success">1100%</span></td>
                      </tr>

                      <tr>
                        <td>SSI</td>
                        <td>3.000</td>
                        <td>40,000</td>
                        <td>8,000</td>
                        <td><span className="text-danger">-80%</span></td>
                      </tr>

                      <tr>
                        <td>AGM</td>
                        <td>3.000</td>
                        <td>8,000</td>
                        <td>12,000</td>
                        <td><span className="text-success">50%</span></td>
                      </tr>

                      <tr>
                        <td>CMT</td>
                        <td>3.000</td>
                        <td>12,000</td>
                        <td>24,000</td>
                        <td><span className="text-success">100%</span></td>
                      </tr>
                    </table>
                </div>
            </div>
        );
    }
});