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

    render: function() {
        var trader = this.props.trader;
        var me = this.props.me;

        console.log(me.get("following_traders"), trader, me.isFollowing(trader));

        if (me.isFollowing(trader)) {
            var btnText = "Bỏ theo đuôi";
        } else {
            var btnText = "Theo đuôi";
        }

        var actionButton = (
            <button className="btn btn-primary">
                {btnText}
            </button>
        );

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
