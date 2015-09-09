import React from "react";
import ImageLoader from "react-imageloader";
import Chart from "chart";
import _ from "underscore";
import * as utils from "../utils";


export var TraderListingScreen = React.createClass({
    propTypes: {
        traders: React.PropTypes.object.isRequired,
        me: React.PropTypes.object.isRequired
    },

    componentDidMount: function() {
        this.props.me.on('change', this.forceUpdate.bind(this));
        this.props.traders.on('change update', this.forceUpdate.bind(this));
    },

    render: function() {
        var traderLines = this.props.traders.map(
            (trader) => <Trader key={trader.cid} me={this.props.me} trader={trader}/>);

        return (
            <div className="trader-listing">
                {traderLines}
            </div>
        );
    }
});


var Trader = React.createClass({
    propTypes: {
        trader: React.PropTypes.object.isRequired,
        me: React.PropTypes.object.isRequired,
    },

    componentDidMount: function() {
        var ctx = this.refs.chart.getDOMNode().getContext("2d");

        var data = {
            labels: [],
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0)",
                    strokeColor: "rgba(243, 145, 0, 1)",
                    data: [65, 59, 80, 81, 56, 55, 40]
                }
            ]
        };
        var perfChart = new Chart(ctx).Line(data, {
            showScale: false,
            scaleShowLabels: false,
            showTooltips: false,
            scaleShowGridLines : true,
            pointDot : false,
            animation: false,
        });
    },

    follow: function() {
        if (window.confirm("Bạn có thực sự muốn theo dõi chiến lược gia này?")) {
            this.props.me.follow(this.props.trader.id);
        }
    },

    unfollow: function() {
        if (window.confirm("Bạn có thực sự muốn bỏ theo dõi chiến lược gia này? Các cổ phiếu bạn đang giữ theo nhà đầu tư này sẽ được bán hết.")) {
            this.props.me.unfollow(this.props.trader.id);
        }
    },

    render: function() {
        var trader = this.props.trader;
        var me = this.props.me;

        if (me.isFollowing(trader)) {
            var actionButton = (
                <button onClick={this.unfollow} className="btn btn-primary btn-unfollow">
                    Bỏ theo dõi
                </button>
            );
        } else {
            var actionButton = (
                <button onClick={this.follow} className="btn btn-primary btn-follow">
                    Theo dõi
                </button>
            );
        }


        return (
            <div className="trader">
                <div className="personal-info">
                    <ImageLoader className="avatar" src={trader.getAvatar()}/>

                    <div>
                        <div className="name">{trader.get("name")}</div>
                        <div className="description">{trader.get("description")}</div>
                    </div>
                </div>

                <div className="perf">
                    <canvas ref="chart" className="perf-chart"></canvas>
                    <div>
                        <div>
                            <div className="ui-label">Số người theo dõi</div>
                            {trader.get("people_following")}
                        </div>

                        <div>
                            <div className="ui-label">Lượng tiền theo dõi</div>
                            {trader.get("total_allocated_money")}
                        </div>

                        <div>
                            <div className="ui-label">Lãi trung bình</div>
                            {utils.formatPercent(trader.get("follower_roi"))}
                        </div>
                    </div>
                </div>

                <div className="extra">
                    {actionButton}
                </div>
            </div>
        );
    }
});
