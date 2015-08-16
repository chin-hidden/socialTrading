import {formatCurrency, getMarketInfo, formatPercent} from "./utils";
import React from "react";
import noUiSlider from "leongersen/noUiSlider/nouislider";
import "leongersen/noUiSlider/nouislider.css!";


export class Slider extends React.Component {
    innerSlider() {
        return this.refs.slider;
    }

    componentDidMount() {
        var slider = this.innerSlider();
        noUiSlider.create(slider, this.props.config);

        slider.noUiSlider.on('change', () => {
            if (this.props.onChange) {
                this.props.onChange(slider.noUiSlider.get());
            }
        });
    }

    render() {
        var padding = 30;
        var styles = {
            wrapper: {
                paddingTop: padding,
                paddingBottom: padding
            }
        };

        return (
            <div style={styles["wrapper"]}>
                <div ref="slider"></div>
            </div>
        );
    }
}

Slider.propTypes = {
    /**
     * A config object for this slider.
     * http://refreshless.com/nouislider/slider-options/
     */
    config: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func,
};


/**
 * A Slider that show each of its values in a tooltip. Subclasses should provide
 * their own `formatTooltip` method.
 */
export class SliderWithTooltip extends Slider {
    formatTooltip(value) {
        return value;
    }

    componentDidMount() {
        super.componentDidMount();

        var tipHandles = this.innerSlider().getElementsByClassName('noUi-handle'),
            tooltips = [];

        // Add divs to the slider handles.
        for (var i = 0; i < tipHandles.length; i++){
            tooltips[i] = document.createElement('div');
            tooltips[i].className += 'slider-tooltip';
            tooltips[i].innerHTML = '<span></span>';
            // tooltips[i] = tooltips[i].getElementsByTagName('span')[0];
            tipHandles[i].appendChild(tooltips[i]);
        }

        this.innerSlider().noUiSlider.on('update', (values, handle) => {
            tooltips[handle].innerHTML = this.formatTooltip(values[handle]);
        });
    }
}


export class MoneySlider extends SliderWithTooltip {
    formatTooltip(value) {
        return formatCurrency(parseFloat(value));
    }

    render() {
        var rendered = super.render();
        // rendered._store.props.className += " money-slider";
        return rendered;
    }
}

export class RiskSlider extends SliderWithTooltip {
    formatTooltip(value) {
        return formatPercent(parseFloat(value) * 10);
    }

    render() {
        var rendered = super.render();
        // rendered._store.props.className += " risk-slider";
        return rendered;
    }
}
