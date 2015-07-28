define(["exports", "common", "utils", "RiskSlider"], function (exports, _common, _utils, _RiskSlider) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

    var _RiskSlider2 = _interopRequireDefault(_RiskSlider);

    var AccountScreen = React.createClass({
        displayName: "AccountScreen",

        getInitialState: function getInitialState() {
            return {
                activeTab: "overview"
            };
        },

        switchTab: function switchTab(tabName, event) {
            event.preventDefault();
            this.setState({ activeTab: tabName });
        },

        render: function render() {
            var tabContent;

            var active = {};

            switch (this.state.activeTab) {
                default:
                case "overview":
                    tabContent = React.createElement(OverviewPanel, null);
                    active["overview"] = "active";
                    break;
                case "danhmuc":
                    tabContent = React.createElement(PositionPanel, null);
                    active["danhmuc"] = "active";
            }

            return React.createElement(
                "div",
                null,
                React.createElement(InfoBox, null),
                React.createElement(
                    "ul",
                    { className: "nav nav-tabs" },
                    React.createElement(
                        "li",
                        { className: active['overview'] },
                        React.createElement(
                            "a",
                            { href: "#", onClick: this.switchTab.bind(this, "overview") },
                            "Tổng quan"
                        )
                    ),
                    React.createElement(
                        "li",
                        { className: active['danhmuc'] },
                        React.createElement(
                            "a",
                            { href: "#", onClick: this.switchTab.bind(this, "danhmuc") },
                            "Danh mục đầu tư"
                        )
                    ),
                    React.createElement(
                        "li",
                        { className: active['solenh'] },
                        React.createElement(
                            "a",
                            { href: "#", onClick: this.switchTab.bind(this, "solenh") },
                            "Sổ lệnh trong ngày"
                        )
                    ),
                    React.createElement(
                        "li",
                        { className: active['lichsugd'] },
                        React.createElement(
                            "a",
                            { href: "#", onClick: this.switchTab.bind(this, "lichsugd") },
                            "Lịch sử giao dịch"
                        )
                    )
                ),
                tabContent
            );
        }
    });

    exports.AccountScreen = AccountScreen;
    var InfoBox = React.createClass({
        displayName: "InfoBox",

        riskSliderChanged: function riskSliderChanged(value) {
            _common.me.set("riskFactor", Math.floor(value));
            _common.me.save(null, {
                success: function success() {
                    alert("Đã lưu!");
                },
                error: function error(model, response, options) {
                    alert("Lỗi!");
                    console.log(model, response, options);
                }
            });
        },

        render: function render() {
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
                }
            };

            return React.createElement(
                "div",
                { className: "panel panel-default" },
                React.createElement(
                    "div",
                    { className: "panel-body clearfix" },
                    React.createElement(
                        "div",
                        { ref: "personalInfo", style: { float: "left", marginRight: spacing } },
                        React.createElement("img", { src: "/static/img/avatar.png", style: { height: 120 } })
                    ),
                    React.createElement(
                        "div",
                        { ref: "personalInfo", style: styles.personalInfo },
                        React.createElement(
                            "strong",
                            { style: { fontSize: "1.5em" } },
                            _common.me.get("name")
                        ),
                        React.createElement("br", null),
                        React.createElement(
                            "div",
                            null,
                            _common.me.get("id"),
                            React.createElement("br", null),
                            "TK: ",
                            _common.me.get("accountNumber")
                        )
                    ),
                    React.createElement(
                        "div",
                        { ref: "accountInfo", style: styles.accountInfo },
                        React.createElement(
                            "div",
                            { className: "row", style: styles.accountInfoRow },
                            React.createElement(
                                "div",
                                { className: "col-md-3" },
                                React.createElement(
                                    "span",
                                    null,
                                    "Lợi nhuận"
                                ),
                                React.createElement("br", null),
                                React.createElement(
                                    "strong",
                                    { className: "text-success" },
                                    (0, _utils.formatCurrency)(_common.me.get("profit"))
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "col-md-3" },
                                React.createElement(
                                    "span",
                                    null,
                                    "Tài sản"
                                ),
                                React.createElement("br", null),
                                React.createElement(
                                    "strong",
                                    { className: "text-success" },
                                    (0, _utils.formatCurrency)(_common.me.get("totalCurrentValue"))
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "col-md-3" },
                                React.createElement(
                                    "span",
                                    null,
                                    "Chứng khoán"
                                ),
                                React.createElement("br", null),
                                React.createElement(
                                    "strong",
                                    { className: "text-success" },
                                    (0, _utils.formatCurrency)(_common.me.get("stockValue"))
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "col-md-3" },
                                React.createElement(
                                    "span",
                                    null,
                                    "Tiền mặt"
                                ),
                                React.createElement("br", null),
                                React.createElement(
                                    "strong",
                                    { className: "text-success" },
                                    (0, _utils.formatCurrency)(_common.me.get("cash"))
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "row", style: styles.accountInfoRow },
                            React.createElement(
                                "div",
                                { className: "col-md-12" },
                                React.createElement(
                                    "h4",
                                    null,
                                    "Tốc độ đầu tư:"
                                ),
                                React.createElement(_RiskSlider2["default"], { ref: "riskSlider",
                                    onChange: this.riskSliderChanged,
                                    style: styles.riskSlider,
                                    withoutPips: true })
                            )
                        )
                    )
                )
            );
        }
    });

    var PositionPanel = React.createClass({
        displayName: "PositionPanel",

        getInitialState: function getInitialState() {
            return {
                viewType: "all",
                marketPrices: {}
            };
        },

        reloadPrices: function reloadPrices() {
            _.map(positions.groupBy("stock"), function (positions, stockSymbol) {});
        },

        componentDidMount: function componentDidMount() {
            _common.me.get("positions").on("change", this.render);
        },

        changeViewType: function changeViewType(event) {
            this.setState({ viewType: event.target.value });
        },

        /**
         * Get position rows, grouped by traders.
         */
        positionRowsByTrader: function positionRowsByTrader(positions) {
            var self = this;

            var posByTrader = positions.groupBy("mimickingUser");
            var result = _.map(posByTrader, function (positions, traderAccount) {
                var rowsForThisTrader = _.map(positions, function (pos) {
                    var marketPrice = self.state.marketPrices[pos.get("stock")];
                    var totalCost = pos.get("buyingPrice") * pos.get("quantity");
                    var totalValue = marketPrice * pos.get("quantity");
                    var gain = totalValue - totalCost;
                    var roi = (gain / totalCost * 100).toFixed(2);
                    return React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            null,
                            pos.get("stock")
                        ),
                        React.createElement(
                            "td",
                            null,
                            "HOSE"
                        ),
                        React.createElement(
                            "td",
                            null,
                            pos.get("quantity")
                        ),
                        React.createElement(
                            "td",
                            null,
                            (0, _utils.formatCurrency)(pos.get("buyingPrice"))
                        ),
                        React.createElement(
                            "td",
                            null,
                            (0, _utils.formatCurrency)(marketPrice)
                        ),
                        React.createElement(
                            "td",
                            null,
                            (0, _utils.formatCurrency)(totalCost)
                        ),
                        React.createElement(
                            "td",
                            null,
                            (0, _utils.formatCurrency)(totalValue)
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                "span",
                                { className: "text-success" },
                                roi,
                                "%"
                            )
                        )
                    );
                });

                var traderName = _common.traders.get(traderAccount).get("name");

                var headerRow = React.createElement(
                    "tr",
                    { style: { backgroundColor: "#cbffaf" } },
                    React.createElement(
                        "td",
                        { colSpan: "7" },
                        traderName
                    ),
                    React.createElement(
                        "td",
                        null,
                        (0, _utils.formatCurrency)(25628674),
                        " (25%)"
                    )
                );

                return _.union([headerRow], rowsForThisTrader);
            });

            return _.flatten(result);
        },

        /**
         * Get position rows, lumped together by stock symbol.
         */
        positionRowsAll: function positionRowsAll(positions) {
            var self = this;

            function add(a, b) {
                return a + b;
            }

            return _.map(positions.groupBy("stock"), function (positions, stockSymbol) {
                var totalCost = _.reduce(_.map(positions, function (pos) {
                    return pos.get("buyingPrice") * pos.get("quantity");
                }), add);
                var totalQuantity = _.reduce(_.map(positions, function (pos) {
                    return pos.get("quantity");
                }), add);

                var marketPrice = self.state.marketPrices[stockSymbol];
                var totalValue = marketPrice * totalQuantity;
                var gain = totalValue - totalCost;
                var roi = (gain / totalCost * 100).toFixed(2);

                return React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "td",
                        null,
                        stockSymbol
                    ),
                    React.createElement(
                        "td",
                        null,
                        "HOSE"
                    ),
                    React.createElement(
                        "td",
                        null,
                        totalQuantity
                    ),
                    React.createElement(
                        "td",
                        null,
                        (0, _utils.formatCurrency)(totalCost / totalQuantity)
                    ),
                    React.createElement(
                        "td",
                        null,
                        (0, _utils.formatCurrency)(marketPrice)
                    ),
                    React.createElement(
                        "td",
                        null,
                        (0, _utils.formatCurrency)(totalCost)
                    ),
                    React.createElement(
                        "td",
                        null,
                        (0, _utils.formatCurrency)(totalValue)
                    ),
                    React.createElement(
                        "td",
                        null,
                        React.createElement(
                            "span",
                            { className: "text-success" },
                            roi,
                            "%"
                        )
                    )
                );
            });
        },

        render: function render() {
            var positions = _common.me.get("positions");
            if (this.state.viewType === "by-trader") {
                var positionRows = this.positionRowsByTrader(positions);
            } else {
                var positionRows = this.positionRowsAll(positions);
            }

            return React.createElement(
                "div",
                { className: "panel panel-default panel-tabbed" },
                React.createElement(
                    "div",
                    { className: "panel-body" },
                    React.createElement(
                        "select",
                        { ref: "viewTypeSelector",
                            value: this.state.viewType,
                            onChange: this.changeViewType,
                            style: { marginBottom: "1em" } },
                        React.createElement(
                            "option",
                            { value: "all" },
                            "Toàn bộ"
                        ),
                        React.createElement(
                            "option",
                            { value: "by-trader" },
                            "Theo chiến lược gia"
                        )
                    ),
                    React.createElement(
                        "table",
                        { className: "table table-striped table-hover table-bordered" },
                        React.createElement(
                            "thead",
                            null,
                            React.createElement(
                                "tr",
                                null,
                                React.createElement(
                                    "th",
                                    null,
                                    "Mã CK"
                                ),
                                React.createElement(
                                    "th",
                                    null,
                                    "Sàn"
                                ),
                                React.createElement(
                                    "th",
                                    null,
                                    "Khối lượng"
                                ),
                                React.createElement(
                                    "th",
                                    null,
                                    "Giá vốn"
                                ),
                                React.createElement(
                                    "th",
                                    null,
                                    "Giá thị trường"
                                ),
                                React.createElement(
                                    "th",
                                    null,
                                    "Tổng giá vốn"
                                ),
                                React.createElement(
                                    "th",
                                    null,
                                    "Tổng giá thị trường"
                                ),
                                React.createElement(
                                    "th",
                                    null,
                                    "Lợi nhuận"
                                )
                            )
                        ),
                        React.createElement(
                            "tbody",
                            null,
                            positionRows
                        )
                    )
                )
            );
        }
    });

    var OverviewPanel = React.createClass({
        displayName: "OverviewPanel",

        componentDidMount: function componentDidMount() {
            var data = {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 80, 81, 56, 55, 40]
                }, {
                    label: "My Second dataset",
                    fillColor: "rgba(255, 153, 0, 0.2)",
                    strokeColor: "rgba(255, 153, 0, 1)",
                    pointColor: "rgba(255, 153, 0, 1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(255, 153, 0, 1)",
                    data: [28, 48, 40, -22, 86, 27, 90]
                }]
            };

            var ctx = this.refs.overviewChart.getDOMNode().getContext("2d");
            var chart = new Chart(ctx).Line(data, {
                responsive: true
            });
        },
        render: function render() {
            var style = "\
        canvas {\
            width: 100%;\
        };";

            return React.createElement(
                "div",
                { className: "panel panel-default panel-overview panel-tabbed" },
                React.createElement(
                    "style",
                    { scoped: true },
                    style
                ),
                React.createElement(
                    "div",
                    { className: "panel-body" },
                    React.createElement(
                        "div",
                        { className: "info-pane" },
                        React.createElement("img", { src: "/static/img/avatar.png", alt: "" }),
                        React.createElement(
                            "div",
                            null,
                            React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "span",
                                    { className: "ui-label-strong" },
                                    "TraderAAA"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "second-line" },
                                React.createElement(
                                    "div",
                                    null,
                                    React.createElement(
                                        "span",
                                        { className: "ui-label-strong" },
                                        "Lãi hiện tại: "
                                    ),
                                    (0, _utils.formatCurrency)(23223423)
                                ),
                                React.createElement(
                                    "div",
                                    null,
                                    React.createElement(
                                        "span",
                                        { className: "ui-label-strong" },
                                        "Lãi thực tế: "
                                    ),
                                    (0, _utils.formatCurrency)(23223423)
                                ),
                                React.createElement(
                                    "div",
                                    null,
                                    React.createElement(
                                        "span",
                                        { className: "ui-label-strong" },
                                        "ROI: "
                                    ),
                                    "24%"
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { ref: "graph", className: "panel-overview-graph" },
                        React.createElement("canvas", { ref: "overviewChart" })
                    )
                )
            );
        }
    });
});
//# sourceMappingURL=accountScreen.js.map