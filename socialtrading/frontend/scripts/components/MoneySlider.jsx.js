import SliderWithTooltip from "./SliderWithTooltip.jsx";
import {formatCurrency} from "../utils";

export default class MoneySlider extends SliderWithTooltip {
    formatTooltip(value) {
        return formatCurrency(parseFloat(value));
    }

    render() {
        var rendered = super.render();
        // rendered._store.props.className += " money-slider";
        return rendered;
    }
}
