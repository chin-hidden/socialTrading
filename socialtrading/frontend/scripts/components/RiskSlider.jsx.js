import SliderWithTooltip from "./SliderWithTooltip.jsx";
import {formatPercent} from "../utils";

export default class RiskSlider extends SliderWithTooltip {
    formatTooltip(value) {
        return formatPercent(parseFloat(value) / 100);
    }

    render() {
        var rendered = super.render();
        // rendered._store.props.className += " risk-slider";
        return rendered;
    }
}
