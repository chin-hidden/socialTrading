import React from "react";
import noUiSlider from "leongersen/noUiSlider/nouislider";
import "leongersen/noUiSlider/nouislider.css!";


export default class Slider extends React.Component {
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
