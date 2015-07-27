import {me} from "common";

/**
 * A slider that is used to represent the risk bar on the UI.
 */
export default class RiskSlider extends React.Component {
    componentDidMount() {
        var slider = this.refs.riskSlider.getDOMNode();
        var _this = this;

        // FIXME: we are calling `me` directly
        var tmp = $(slider).noUiSlider({
            start: [ me.get("riskFactor") ],
            step: 10,
            connect: "lower",
            range: {
                'min': [0],
                'max': [100]
            }
        }).on("change", function() {
            if (_this.props.onChange) {
                _this.props.onChange($(slider).val());
            }
        });

        if (!this.props.withoutPips) {
            tmp.noUiSlider_pips({
                mode: "positions",
                stepped: true,
                values: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                densitiy: 4
            });
        }
    }

    render() {
        return (<div ref="riskSlider" style={this.props.style}></div>);
    }
}
