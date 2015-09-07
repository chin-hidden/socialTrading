import React from "react";
import noUiSlider from "leongersen/noUiSlider/nouislider";
import "leongersen/noUiSlider/nouislider.css!";


export default class Slider extends React.Component {

    /**
     * Override this method to include more class names.
     */
    getClass() {
        return "";
    }

    innerSlider() {
        return this.refs.slider.getDOMNode();
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
        return (
            <div ref="slider" className={this.getClass()}></div>
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
