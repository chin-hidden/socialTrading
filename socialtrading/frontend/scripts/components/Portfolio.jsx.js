import React from "react";
import _ from "underscore";
import Carousel from 'nuka-carousel';

import DependencyInjectedMixin from "./DependencyInjectedMixin.jsx";
import {formatCurrency} from "../utils";
import {notificationStore} from "../server-noti";


var Portfolio = React.createClass({
    mixins: [DependencyInjectedMixin],

    propTypes: {
        follower: React.PropTypes.object.isRequired
    },

    componentDidMount() {
        this.props.follower.get("deals").on("update change", () => {
            this.forceUpdate();
        });

        this.props.follower.get("following_traders").on("update change", () => {
            this.forceUpdate();
        });

        // DISPATCHER.on("stock:changed", () => {
        //     this.forceUpdate();
        // });
    },

    render() {
        // List of RelStrip's
        var rels = this.props.follower.get('following_traders');
        var relStrips = rels.map((rel) => <RelStrip key={rel.cid} relationship={rel}/>);

        return (
            <div className="portfolio">
                {relStrips}
            </div>
        );
    },
});


var RelStrip = React.createClass({
    mixins: [DependencyInjectedMixin],

    propTypes: {
        relationship: React.PropTypes.object.isRequired,
        traders: React.PropTypes.object.isRequired
    },

    render: function() {
        var rel = this.props.relationship;
        var trader = this.props.traders.get(rel.get('trader_id'));

        var deals = this.props.follower.get('deals').filter((deal) => {
            return deal.get("mimicking_username") == trader.get('username')
                && deal.get('username') == this.props.follower.get('username');
        });

        var partitionedDeals = _.partition(deals, (deal) => deal.get('status') === 'SELLING:Filled');
        // FIXME: pagination/carousel for the active deals.
        var activeDeals = _.first(partitionedDeals[1], 4);
        var oldDeals = partitionedDeals[0];
        var visibleOldDeals = _.first(oldDeals, 2);

        var dealToCard = (deal) => <DealCard key={deal.id} deal={deal}/>;

        if (activeDeals.length === 0) {
            var dealCards = (<span className="ui-label">Bạn không có cổ phiếu nào mua theo nhà đầu tư này.</span>);
        } else {
            var dealCards = activeDeals.map(dealToCard);
        }

        if (_.size(visibleOldDeals) > 0) {
            var oldDealCards = visibleOldDeals.map(dealToCard);
            var oldDealSection = (
                <div className="old-deals">
                    <div className="cards">
                        {oldDealCards}
                    </div>

                    <div className="ui-label section-label">
                        Đã bán
                    </div>
                </div>
            );
        } else {
            var oldDealSection = undefined;
        }

        return (
            <div className="rel-strip">
                <div className="rel-overview">
                    <div>
                        <img src={trader.getAvatar()} style={{height: 120}} className="img-thumbnail"/>
                    </div>

                    <div className="name">{trader.get('name')}</div>
                    <table className="ui-label">
                        <tr>
                            <td>kết quả:</td>
                            <td>{formatCurrency(rel.get("profit"))}</td>
                        </tr>
                    </table>
                </div>

                <div className="active-deals">
                    <div className="cards">
                        {dealCards}
                    </div>

                    <div className="section-label ui-label">
                        Đang giữ
                    </div>
                </div>

                {oldDealSection}
            </div>
        );
    }
});


var DealCard = React.createClass({
    mixins: [DependencyInjectedMixin],

    propTypes: {
        deal: React.PropTypes.object.isRequired,
        stockStore: React.PropTypes.object.isRequired
    },

    componentDidMount() {
        this.props.stockStore.on("change", () => {
            this.forceUpdate();
        });
    },

    render() {
        var deal = this.props.deal;

        var marketPrice = 0;
        if (deal.get("status") === "SELLING:Filled") {
            marketPrice = deal.get("selling_price");
        } else {
            marketPrice = this.props.stockStore.get(deal.get("symbol")).get("matchPrice");
        }

        var profit = deal.get("quantity") * (marketPrice - deal.get("buying_price"));
        var cardClassNames = "deal-card";

        if (profit < 0) {
            cardClassNames += " unprofitable";
        }

        return (
            <div className={cardClassNames}>
                <div className="symbol">{deal.get('symbol')}</div>
                <div className="value">
                    <div className="ui-label">Giá trị</div>
                    <div>{formatCurrency(deal.get('quantity') * deal.get('buying_price'))}</div>
                </div>

                <div className="profit">
                    <div className="ui-label">Kết quả</div>
                    <div>{formatCurrency(profit)}</div>
                </div>
            </div>
        );
    }
});

export default Portfolio;
