import Slider from "./Slider.jsx";

/**
 * A Slider that show each of its values in a tooltip. Subclasses should provide
 * their own `formatTooltip` method.
 */
export default class SliderWithTooltip extends Slider {
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
