import React from "react";
import * as BS from "react-bootstrap";
import _ from "underscore";
import Carousel from 'nuka-carousel';

import DependencyInjectedMixin from "./DependencyInjectedMixin.jsx";
import * as utils from "../utils";
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
                            <td>{utils.formatCurrency(rel.get("profit"))}</td>
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

    getInitialState() {
        return {
            showDealDetail: false
        };
    },

    componentDidMount() {
        this.props.stockStore.on("update", () => {
            this.forceUpdate();
        });
    },

    render() {
        try {
            var deal = this.props.deal;
            var marketPrice = deal.getMarketPrice();
            var profit = deal.getProfit();

            var cardClassNames = "deal-card";

            if (profit < 0) {
                cardClassNames += " unprofitable";
            }

            return (
                <div className={cardClassNames} onClick={this.toggleDetail.bind(this, true)}>
                    <div className="symbol">{deal.get('symbol')}</div>
                    <div className="value">
                        <div className="ui-label">Giá trị</div>
                        <div>{utils.formatCurrency(deal.get('quantity') * deal.get('buying_price'))}</div>
                    </div>

                    <div className="profit">
                        <div className="ui-label">Kết quả</div>
                        <div>{utils.formatCurrency(profit)}</div>
                    </div>

                    <DealDetail {...this.props}
                                show={this.state.showDealDetail}
                                onHide={this.toggleDetail.bind(this, false)}/>
                </div>
            );
        } catch (e) {
            return (
                <div className="deal-card">Loading</div>
            );
        }
    },

    toggleDetail(isShow) {
        this.setState({
            showDealDetail: isShow
        });
    }
});


var DealDetail = React.createClass({
    propTypes: {
        stockStore: React.PropTypes.object.isRequired,
        deal: React.PropTypes.object.isRequired
    },

    render() {
        var Modal = BS.Modal,
            Button = BS.Button,
            ButtonToolbar = BS.ButtonToolbar,
            Row = BS.Row,
            Col = BS.Col,
            deal = this.props.deal;

        var symbol = this.props.deal.get("symbol");
        var stock = this.props.stockStore.get(symbol);
        var symbolDetailLink = `https://www.vndirect.com.vn/portal/tong-quan/${symbol.toLowerCase()}.shtml`;

        return (
            <Modal className="deal-detail" {...this.props}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div className="symbol">
                            <a href={symbolDetailLink} target="_blank">{deal.get("symbol")}</a>
                        </div>

                        <div className="value">
                            Giá trị<br/>
                            <span className="number">{utils.formatCurrency(deal.getMarketValue())}</span>
                        </div>

                        <div className="profit">
                            Kết quả<br/>
                            <span className="number">{utils.formatCurrency(deal.getProfit())}</span>
                        </div>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div>
                        <table className="table table-colored">
                            <tr>
                                <th>Số lượng</th>
                                <th>Giá vốn</th>
                                <th>Giá thị trường</th>
                                <th>Tổng vốn</th>
                                <th>Tổng giá trị thị trường</th>
                                <th>Lãi/lỗ</th>
                            </tr>

                            <tr>
                                <td>{deal.get("quantity")}</td>
                                <td>{utils.formatCurrency(deal.get("buying_price"), true)}</td>
                                <td>{utils.formatCurrency(deal.getMarketPrice(), true)}</td>
                                <td>{utils.formatCurrency(deal.getBuyingValue(), true)}</td>
                                <td>{utils.formatCurrency(deal.getMarketValue(), true)}</td>
                                <td>{utils.formatCurrency(deal.getProfit(), true)}</td>
                            </tr>
                        </table>
                    </div>

                    <div>

                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <ButtonToolbar className="pull-right">
                        <Button bsStyle='primary' onClick={() => alert("Tính năng này đang được xây dựng. \nQuý khách vui lòng quay lại sau.")}>Bán</Button>
                        <Button onClick={this.props.onHide}>Đóng</Button>
                    </ButtonToolbar>
                </Modal.Footer>
            </Modal>
        );
    }
});

export default Portfolio;
