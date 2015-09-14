import * as app from "../app";

/**
 * A React component that is dependency injected will have, by default, all the
 * global singletons defined in app.js as props.
 */
var DependencyInjectedMixin = {
    getDefaultProps: function() {
        return app;
    }
};

export default DependencyInjectedMixin;
