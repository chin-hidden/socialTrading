System.config({
  "baseURL": "/static/",
  "transpiler": "babel",
  "babelOptions": {
    "optional": [
      "runtime"
    ],
    "blacklist": []
  },
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "depCache": {
    "npm:react@0.14.0-beta3/lib/dangerousStyleValue": [
      "npm:react@0.14.0-beta3/lib/CSSProperty"
    ],
    "npm:fbjs@0.1.0-alpha.4/lib/toArray": [
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:fbjs@0.1.0-alpha.4/lib/getMarkupWrap": [
      "npm:fbjs@0.1.0-alpha.4/lib/ExecutionEnvironment",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:fbjs@0.1.0-alpha.4/lib/keyMirror": [
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/setInnerHTML": [
      "npm:fbjs@0.1.0-alpha.4/lib/ExecutionEnvironment",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/setTextContent": [
      "npm:fbjs@0.1.0-alpha.4/lib/ExecutionEnvironment",
      "npm:react@0.14.0-beta3/lib/escapeTextContentForBrowser",
      "npm:react@0.14.0-beta3/lib/setInnerHTML"
    ],
    "npm:react@0.14.0-beta3/lib/EventConstants": [
      "npm:fbjs@0.1.0-alpha.4/lib/keyMirror"
    ],
    "npm:react@0.14.0-beta3/lib/EventPluginRegistry": [
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/EventPluginUtils": [
      "npm:react@0.14.0-beta3/lib/EventConstants",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/accumulateInto": [
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactEventEmitterMixin": [
      "npm:react@0.14.0-beta3/lib/EventPluginHub"
    ],
    "npm:react@0.14.0-beta3/lib/isEventSupported": [
      "npm:fbjs@0.1.0-alpha.4/lib/ExecutionEnvironment"
    ],
    "npm:react@0.14.0-beta3/lib/ReactElement": [
      "npm:react@0.14.0-beta3/lib/ReactCurrentOwner",
      "npm:react@0.14.0-beta3/lib/Object.assign",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactPerf": [
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactOwner": [
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/PooledClass": [
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/Transaction": [
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:fbjs@0.1.0-alpha.4/lib/emptyObject": [
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactComponentEnvironment": [
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactPropTypeLocations": [
      "npm:fbjs@0.1.0-alpha.4/lib/keyMirror"
    ],
    "npm:react@0.14.0-beta3/lib/ReactPropTypeLocationNames": [
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactNativeComponent": [
      "npm:react@0.14.0-beta3/lib/Object.assign",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/validateDOMNesting": [
      "npm:react@0.14.0-beta3/lib/Object.assign",
      "npm:fbjs@0.1.0-alpha.4/lib/emptyFunction",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/findDOMNode": [
      "npm:react@0.14.0-beta3/lib/ReactCurrentOwner",
      "npm:react@0.14.0-beta3/lib/ReactInstanceMap",
      "npm:react@0.14.0-beta3/lib/ReactMount",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactFragment": [
      "npm:react@0.14.0-beta3/lib/ReactElement",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/traverseAllChildren": [
      "npm:react@0.14.0-beta3/lib/ReactElement",
      "npm:react@0.14.0-beta3/lib/ReactFragment",
      "npm:react@0.14.0-beta3/lib/ReactInstanceHandles",
      "npm:react@0.14.0-beta3/lib/getIteratorFn",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactDOMSelect": [
      "npm:react@0.14.0-beta3/lib/LinkedValueUtils",
      "npm:react@0.14.0-beta3/lib/ReactMount",
      "npm:react@0.14.0-beta3/lib/ReactUpdates",
      "npm:react@0.14.0-beta3/lib/Object.assign",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactDOMTextarea": [
      "npm:react@0.14.0-beta3/lib/LinkedValueUtils",
      "npm:react@0.14.0-beta3/lib/ReactDOMIDOperations",
      "npm:react@0.14.0-beta3/lib/ReactUpdates",
      "npm:react@0.14.0-beta3/lib/Object.assign",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/flattenChildren": [
      "npm:react@0.14.0-beta3/lib/traverseAllChildren",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/EventPropagators": [
      "npm:react@0.14.0-beta3/lib/EventConstants",
      "npm:react@0.14.0-beta3/lib/EventPluginHub",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "npm:react@0.14.0-beta3/lib/accumulateInto",
      "npm:react@0.14.0-beta3/lib/forEachAccumulated",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/getTextContentAccessor": [
      "npm:fbjs@0.1.0-alpha.4/lib/ExecutionEnvironment"
    ],
    "npm:react@0.14.0-beta3/lib/SyntheticEvent": [
      "npm:react@0.14.0-beta3/lib/PooledClass",
      "npm:react@0.14.0-beta3/lib/Object.assign",
      "npm:fbjs@0.1.0-alpha.4/lib/emptyFunction"
    ],
    "npm:react@0.14.0-beta3/lib/SyntheticInputEvent": [
      "npm:react@0.14.0-beta3/lib/SyntheticEvent"
    ],
    "npm:react@0.14.0-beta3/lib/DefaultEventPluginOrder": [
      "npm:fbjs@0.1.0-alpha.4/lib/keyOf"
    ],
    "npm:react@0.14.0-beta3/lib/HTMLDOMPropertyConfig": [
      "npm:react@0.14.0-beta3/lib/DOMProperty",
      "npm:fbjs@0.1.0-alpha.4/lib/ExecutionEnvironment"
    ],
    "npm:react@0.14.0-beta3/lib/ReactBrowserComponentMixin": [
      "npm:react@0.14.0-beta3/lib/ReactInstanceMap",
      "npm:react@0.14.0-beta3/lib/findDOMNode",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactDefaultBatchingStrategy": [
      "npm:react@0.14.0-beta3/lib/ReactUpdates",
      "npm:react@0.14.0-beta3/lib/Transaction",
      "npm:react@0.14.0-beta3/lib/Object.assign",
      "npm:fbjs@0.1.0-alpha.4/lib/emptyFunction"
    ],
    "npm:fbjs@0.1.0-alpha.4/lib/EventListener": [
      "npm:fbjs@0.1.0-alpha.4/lib/emptyFunction",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactNoopUpdateQueue": [
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/SelectEventPlugin": [
      "npm:react@0.14.0-beta3/lib/EventConstants",
      "npm:react@0.14.0-beta3/lib/EventPropagators",
      "npm:react@0.14.0-beta3/lib/ReactInputSelection",
      "npm:react@0.14.0-beta3/lib/SyntheticEvent",
      "npm:fbjs@0.1.0-alpha.4/lib/getActiveElement",
      "npm:react@0.14.0-beta3/lib/isTextInputElement",
      "npm:fbjs@0.1.0-alpha.4/lib/keyOf",
      "npm:fbjs@0.1.0-alpha.4/lib/shallowEqual"
    ],
    "npm:react@0.14.0-beta3/lib/SyntheticClipboardEvent": [
      "npm:react@0.14.0-beta3/lib/SyntheticEvent"
    ],
    "npm:react@0.14.0-beta3/lib/SyntheticFocusEvent": [
      "npm:react@0.14.0-beta3/lib/SyntheticUIEvent"
    ],
    "npm:react@0.14.0-beta3/lib/getEventKey": [
      "npm:react@0.14.0-beta3/lib/getEventCharCode"
    ],
    "npm:react@0.14.0-beta3/lib/SyntheticDragEvent": [
      "npm:react@0.14.0-beta3/lib/SyntheticMouseEvent"
    ],
    "npm:react@0.14.0-beta3/lib/SyntheticTouchEvent": [
      "npm:react@0.14.0-beta3/lib/SyntheticUIEvent",
      "npm:react@0.14.0-beta3/lib/getEventModifierState"
    ],
    "npm:react@0.14.0-beta3/lib/SyntheticWheelEvent": [
      "npm:react@0.14.0-beta3/lib/SyntheticMouseEvent"
    ],
    "npm:react@0.14.0-beta3/lib/SVGDOMPropertyConfig": [
      "npm:react@0.14.0-beta3/lib/DOMProperty"
    ],
    "npm:react@0.14.0-beta3/lib/ReactDefaultPerfAnalysis": [
      "npm:react@0.14.0-beta3/lib/Object.assign"
    ],
    "npm:fbjs@0.1.0-alpha.4/lib/performance": [
      "npm:fbjs@0.1.0-alpha.4/lib/ExecutionEnvironment"
    ],
    "npm:react@0.14.0-beta3/lib/renderSubtreeIntoContainer": [
      "npm:react@0.14.0-beta3/lib/ReactMount"
    ],
    "npm:react@0.14.0-beta3/lib/ReactServerRenderingTransaction": [
      "npm:react@0.14.0-beta3/lib/PooledClass",
      "npm:react@0.14.0-beta3/lib/CallbackQueue",
      "npm:react@0.14.0-beta3/lib/Transaction",
      "npm:react@0.14.0-beta3/lib/Object.assign",
      "npm:fbjs@0.1.0-alpha.4/lib/emptyFunction"
    ],
    "npm:react@0.14.0-beta3/lib/ReactElementValidator": [
      "npm:react@0.14.0-beta3/lib/ReactElement",
      "npm:react@0.14.0-beta3/lib/ReactFragment",
      "npm:react@0.14.0-beta3/lib/ReactPropTypeLocations",
      "npm:react@0.14.0-beta3/lib/ReactPropTypeLocationNames",
      "npm:react@0.14.0-beta3/lib/ReactCurrentOwner",
      "npm:react@0.14.0-beta3/lib/getIteratorFn",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/onlyChild": [
      "npm:react@0.14.0-beta3/lib/ReactElement",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/deprecated": [
      "npm:react@0.14.0-beta3/lib/Object.assign",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:core-js@0.9.18/library/modules/$.def": [
      "npm:core-js@0.9.18/library/modules/$"
    ],
    "npm:core-js@0.9.18/library/modules/$.get-names": [
      "npm:core-js@0.9.18/library/modules/$"
    ],
    "npm:core-js@0.9.18/library/fn/object/create": [
      "npm:core-js@0.9.18/library/modules/$"
    ],
    "npm:core-js@0.9.18/library/modules/$.assert": [
      "npm:core-js@0.9.18/library/modules/$"
    ],
    "npm:core-js@0.9.18/library/modules/$.ctx": [
      "npm:core-js@0.9.18/library/modules/$.assert"
    ],
    "npm:core-js@0.9.18/library/fn/object/define-property": [
      "npm:core-js@0.9.18/library/modules/$"
    ],
    "npm:process@0.10.1": [
      "npm:process@0.10.1/browser"
    ],
    "npm:react@0.14.0-beta3/lib/quoteAttributeValueForBrowser": [
      "npm:react@0.14.0-beta3/lib/escapeTextContentForBrowser"
    ],
    "npm:fbjs@0.1.0-alpha.4/lib/warning": [
      "npm:fbjs@0.1.0-alpha.4/lib/emptyFunction",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:fbjs@0.1.0-alpha.4/lib/camelizeStyleName": [
      "npm:fbjs@0.1.0-alpha.4/lib/camelize"
    ],
    "npm:fbjs@0.1.0-alpha.4/lib/hyphenateStyleName": [
      "npm:fbjs@0.1.0-alpha.4/lib/hyphenate"
    ],
    "npm:fbjs@0.1.0-alpha.4/lib/createArrayFromMixed": [
      "npm:fbjs@0.1.0-alpha.4/lib/toArray"
    ],
    "npm:react@0.14.0-beta3/lib/ReactMultiChildUpdateTypes": [
      "npm:fbjs@0.1.0-alpha.4/lib/keyMirror"
    ],
    "npm:react@0.14.0-beta3/lib/EventPluginHub": [
      "npm:react@0.14.0-beta3/lib/EventPluginRegistry",
      "npm:react@0.14.0-beta3/lib/EventPluginUtils",
      "npm:react@0.14.0-beta3/lib/accumulateInto",
      "npm:react@0.14.0-beta3/lib/forEachAccumulated",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactEmptyComponent": [
      "npm:react@0.14.0-beta3/lib/ReactElement",
      "npm:react@0.14.0-beta3/lib/ReactInstanceMap",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactInstanceHandles": [
      "npm:react@0.14.0-beta3/lib/ReactRootIndex",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactMarkupChecksum": [
      "npm:react@0.14.0-beta3/lib/adler32"
    ],
    "npm:react@0.14.0-beta3/lib/ReactRef": [
      "npm:react@0.14.0-beta3/lib/ReactOwner",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/CallbackQueue": [
      "npm:react@0.14.0-beta3/lib/PooledClass",
      "npm:react@0.14.0-beta3/lib/Object.assign",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:fbjs@0.1.0-alpha.4/lib/isTextNode": [
      "npm:fbjs@0.1.0-alpha.4/lib/isNode"
    ],
    "npm:react@0.14.0-beta3/lib/ReactCompositeComponent": [
      "npm:react@0.14.0-beta3/lib/ReactComponentEnvironment",
      "npm:react@0.14.0-beta3/lib/ReactCurrentOwner",
      "npm:react@0.14.0-beta3/lib/ReactElement",
      "npm:react@0.14.0-beta3/lib/ReactInstanceMap",
      "npm:react@0.14.0-beta3/lib/ReactPerf",
      "npm:react@0.14.0-beta3/lib/ReactPropTypeLocations",
      "npm:react@0.14.0-beta3/lib/ReactPropTypeLocationNames",
      "npm:react@0.14.0-beta3/lib/ReactReconciler",
      "npm:react@0.14.0-beta3/lib/ReactUpdateQueue",
      "npm:react@0.14.0-beta3/lib/Object.assign",
      "npm:fbjs@0.1.0-alpha.4/lib/emptyObject",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "npm:react@0.14.0-beta3/lib/shouldUpdateReactComponent",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/AutoFocusUtils": [
      "npm:react@0.14.0-beta3/lib/ReactMount",
      "npm:react@0.14.0-beta3/lib/findDOMNode",
      "npm:fbjs@0.1.0-alpha.4/lib/focusNode"
    ],
    "npm:react@0.14.0-beta3/lib/ReactPropTypes": [
      "npm:react@0.14.0-beta3/lib/ReactElement",
      "npm:react@0.14.0-beta3/lib/ReactFragment",
      "npm:react@0.14.0-beta3/lib/ReactPropTypeLocationNames",
      "npm:fbjs@0.1.0-alpha.4/lib/emptyFunction",
      "npm:react@0.14.0-beta3/lib/getIteratorFn"
    ],
    "npm:react@0.14.0-beta3/lib/ReactChildren": [
      "npm:react@0.14.0-beta3/lib/PooledClass",
      "npm:react@0.14.0-beta3/lib/ReactFragment",
      "npm:react@0.14.0-beta3/lib/traverseAllChildren",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactChildReconciler": [
      "npm:react@0.14.0-beta3/lib/ReactReconciler",
      "npm:react@0.14.0-beta3/lib/flattenChildren",
      "npm:react@0.14.0-beta3/lib/instantiateReactComponent",
      "npm:react@0.14.0-beta3/lib/shouldUpdateReactComponent",
      "npm:react@0.14.0-beta3/lib/traverseAllChildren",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/FallbackCompositionState": [
      "npm:react@0.14.0-beta3/lib/PooledClass",
      "npm:react@0.14.0-beta3/lib/Object.assign",
      "npm:react@0.14.0-beta3/lib/getTextContentAccessor"
    ],
    "npm:react@0.14.0-beta3/lib/SyntheticCompositionEvent": [
      "npm:react@0.14.0-beta3/lib/SyntheticEvent"
    ],
    "npm:react@0.14.0-beta3/lib/ChangeEventPlugin": [
      "npm:react@0.14.0-beta3/lib/EventConstants",
      "npm:react@0.14.0-beta3/lib/EventPluginHub",
      "npm:react@0.14.0-beta3/lib/EventPropagators",
      "npm:fbjs@0.1.0-alpha.4/lib/ExecutionEnvironment",
      "npm:react@0.14.0-beta3/lib/ReactUpdates",
      "npm:react@0.14.0-beta3/lib/SyntheticEvent",
      "npm:react@0.14.0-beta3/lib/isEventSupported",
      "npm:react@0.14.0-beta3/lib/isTextInputElement",
      "npm:fbjs@0.1.0-alpha.4/lib/keyOf",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/SyntheticUIEvent": [
      "npm:react@0.14.0-beta3/lib/SyntheticEvent",
      "npm:react@0.14.0-beta3/lib/getEventTarget"
    ],
    "npm:react@0.14.0-beta3/lib/ReactEventListener": [
      "npm:fbjs@0.1.0-alpha.4/lib/EventListener",
      "npm:fbjs@0.1.0-alpha.4/lib/ExecutionEnvironment",
      "npm:react@0.14.0-beta3/lib/PooledClass",
      "npm:react@0.14.0-beta3/lib/ReactInstanceHandles",
      "npm:react@0.14.0-beta3/lib/ReactMount",
      "npm:react@0.14.0-beta3/lib/ReactUpdates",
      "npm:react@0.14.0-beta3/lib/Object.assign",
      "npm:react@0.14.0-beta3/lib/getEventTarget",
      "npm:fbjs@0.1.0-alpha.4/lib/getUnboundedScrollPosition",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactComponent": [
      "npm:react@0.14.0-beta3/lib/ReactNoopUpdateQueue",
      "npm:fbjs@0.1.0-alpha.4/lib/emptyObject",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactDOMSelection": [
      "npm:fbjs@0.1.0-alpha.4/lib/ExecutionEnvironment",
      "npm:react@0.14.0-beta3/lib/getNodeForCharacterOffset",
      "npm:react@0.14.0-beta3/lib/getTextContentAccessor"
    ],
    "npm:react@0.14.0-beta3/lib/SyntheticKeyboardEvent": [
      "npm:react@0.14.0-beta3/lib/SyntheticUIEvent",
      "npm:react@0.14.0-beta3/lib/getEventCharCode",
      "npm:react@0.14.0-beta3/lib/getEventKey",
      "npm:react@0.14.0-beta3/lib/getEventModifierState"
    ],
    "npm:fbjs@0.1.0-alpha.4/lib/performanceNow": [
      "npm:fbjs@0.1.0-alpha.4/lib/performance"
    ],
    "npm:react@0.14.0-beta3/lib/ReactServerRendering": [
      "npm:react@0.14.0-beta3/lib/ReactDefaultBatchingStrategy",
      "npm:react@0.14.0-beta3/lib/ReactElement",
      "npm:react@0.14.0-beta3/lib/ReactInstanceHandles",
      "npm:react@0.14.0-beta3/lib/ReactMarkupChecksum",
      "npm:react@0.14.0-beta3/lib/ReactServerBatchingStrategy",
      "npm:react@0.14.0-beta3/lib/ReactServerRenderingTransaction",
      "npm:react@0.14.0-beta3/lib/ReactUpdates",
      "npm:fbjs@0.1.0-alpha.4/lib/emptyObject",
      "npm:react@0.14.0-beta3/lib/instantiateReactComponent",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactDOMFactories": [
      "npm:react@0.14.0-beta3/lib/ReactElement",
      "npm:react@0.14.0-beta3/lib/ReactElementValidator",
      "npm:fbjs@0.1.0-alpha.4/lib/mapObject",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:underscore@1.8.3": [
      "npm:underscore@1.8.3/underscore"
    ],
    "github:components/jquery@2.1.4": [
      "github:components/jquery@2.1.4/jquery"
    ],
    "npm:core-js@0.9.18/library/modules/$": [
      "npm:core-js@0.9.18/library/modules/$.fw"
    ],
    "npm:core-js@0.9.18/library/modules/es6.object.statics-accept-primitives": [
      "npm:core-js@0.9.18/library/modules/$",
      "npm:core-js@0.9.18/library/modules/$.def",
      "npm:core-js@0.9.18/library/modules/$.get-names"
    ],
    "npm:babel-runtime@5.8.20/core-js/object/create": [
      "npm:core-js@0.9.18/library/fn/object/create"
    ],
    "npm:core-js@0.9.18/library/modules/$.set-proto": [
      "npm:core-js@0.9.18/library/modules/$",
      "npm:core-js@0.9.18/library/modules/$.assert",
      "npm:core-js@0.9.18/library/modules/$.ctx"
    ],
    "npm:babel-runtime@5.8.20/core-js/object/define-property": [
      "npm:core-js@0.9.18/library/fn/object/define-property"
    ],
    "github:nnnick/Chart.js@1.0.2": [
      "github:nnnick/Chart.js@1.0.2/Chart"
    ],
    "github:jspm/nodelibs-process@0.1.1/index": [
      "npm:process@0.10.1"
    ],
    "npm:react@0.14.0-beta3/lib/CSSPropertyOperations": [
      "npm:react@0.14.0-beta3/lib/CSSProperty",
      "npm:fbjs@0.1.0-alpha.4/lib/ExecutionEnvironment",
      "npm:fbjs@0.1.0-alpha.4/lib/camelizeStyleName",
      "npm:react@0.14.0-beta3/lib/dangerousStyleValue",
      "npm:fbjs@0.1.0-alpha.4/lib/hyphenateStyleName",
      "npm:react@0.14.0-beta3/lib/memoizeStringOnly",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:fbjs@0.1.0-alpha.4/lib/createNodesFromMarkup": [
      "npm:fbjs@0.1.0-alpha.4/lib/ExecutionEnvironment",
      "npm:fbjs@0.1.0-alpha.4/lib/createArrayFromMixed",
      "npm:fbjs@0.1.0-alpha.4/lib/getMarkupWrap",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactBrowserEventEmitter": [
      "npm:react@0.14.0-beta3/lib/EventConstants",
      "npm:react@0.14.0-beta3/lib/EventPluginHub",
      "npm:react@0.14.0-beta3/lib/EventPluginRegistry",
      "npm:react@0.14.0-beta3/lib/ReactEventEmitterMixin",
      "npm:react@0.14.0-beta3/lib/ViewportMetrics",
      "npm:react@0.14.0-beta3/lib/Object.assign",
      "npm:react@0.14.0-beta3/lib/isEventSupported",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactReconciler": [
      "npm:react@0.14.0-beta3/lib/ReactRef"
    ],
    "npm:react@0.14.0-beta3/lib/ReactUpdates": [
      "npm:react@0.14.0-beta3/lib/CallbackQueue",
      "npm:react@0.14.0-beta3/lib/PooledClass",
      "npm:react@0.14.0-beta3/lib/ReactPerf",
      "npm:react@0.14.0-beta3/lib/ReactReconciler",
      "npm:react@0.14.0-beta3/lib/Transaction",
      "npm:react@0.14.0-beta3/lib/Object.assign",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:fbjs@0.1.0-alpha.4/lib/containsNode": [
      "npm:fbjs@0.1.0-alpha.4/lib/isTextNode"
    ],
    "npm:react@0.14.0-beta3/lib/instantiateReactComponent": [
      "npm:react@0.14.0-beta3/lib/ReactCompositeComponent",
      "npm:react@0.14.0-beta3/lib/ReactEmptyComponent",
      "npm:react@0.14.0-beta3/lib/ReactNativeComponent",
      "npm:react@0.14.0-beta3/lib/Object.assign",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/LinkedValueUtils": [
      "npm:react@0.14.0-beta3/lib/ReactPropTypes",
      "npm:react@0.14.0-beta3/lib/ReactPropTypeLocations",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactDOMOption": [
      "npm:react@0.14.0-beta3/lib/ReactChildren",
      "npm:react@0.14.0-beta3/lib/ReactDOMSelect",
      "npm:react@0.14.0-beta3/lib/Object.assign",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactMultiChild": [
      "npm:react@0.14.0-beta3/lib/ReactComponentEnvironment",
      "npm:react@0.14.0-beta3/lib/ReactMultiChildUpdateTypes",
      "npm:react@0.14.0-beta3/lib/ReactReconciler",
      "npm:react@0.14.0-beta3/lib/ReactChildReconciler",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/BeforeInputEventPlugin": [
      "npm:react@0.14.0-beta3/lib/EventConstants",
      "npm:react@0.14.0-beta3/lib/EventPropagators",
      "npm:fbjs@0.1.0-alpha.4/lib/ExecutionEnvironment",
      "npm:react@0.14.0-beta3/lib/FallbackCompositionState",
      "npm:react@0.14.0-beta3/lib/SyntheticCompositionEvent",
      "npm:react@0.14.0-beta3/lib/SyntheticInputEvent",
      "npm:fbjs@0.1.0-alpha.4/lib/keyOf"
    ],
    "npm:react@0.14.0-beta3/lib/SyntheticMouseEvent": [
      "npm:react@0.14.0-beta3/lib/SyntheticUIEvent",
      "npm:react@0.14.0-beta3/lib/ViewportMetrics",
      "npm:react@0.14.0-beta3/lib/getEventModifierState"
    ],
    "npm:react@0.14.0-beta3/lib/ReactClass": [
      "npm:react@0.14.0-beta3/lib/ReactComponent",
      "npm:react@0.14.0-beta3/lib/ReactElement",
      "npm:react@0.14.0-beta3/lib/ReactErrorUtils",
      "npm:react@0.14.0-beta3/lib/ReactPropTypeLocations",
      "npm:react@0.14.0-beta3/lib/ReactPropTypeLocationNames",
      "npm:react@0.14.0-beta3/lib/ReactNoopUpdateQueue",
      "npm:react@0.14.0-beta3/lib/Object.assign",
      "npm:fbjs@0.1.0-alpha.4/lib/emptyObject",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "npm:fbjs@0.1.0-alpha.4/lib/keyMirror",
      "npm:fbjs@0.1.0-alpha.4/lib/keyOf",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactInputSelection": [
      "npm:react@0.14.0-beta3/lib/ReactDOMSelection",
      "npm:fbjs@0.1.0-alpha.4/lib/containsNode",
      "npm:fbjs@0.1.0-alpha.4/lib/focusNode",
      "npm:fbjs@0.1.0-alpha.4/lib/getActiveElement"
    ],
    "npm:react@0.14.0-beta3/lib/SimpleEventPlugin": [
      "npm:react@0.14.0-beta3/lib/EventConstants",
      "npm:fbjs@0.1.0-alpha.4/lib/EventListener",
      "npm:react@0.14.0-beta3/lib/EventPluginUtils",
      "npm:react@0.14.0-beta3/lib/EventPropagators",
      "npm:react@0.14.0-beta3/lib/ReactMount",
      "npm:react@0.14.0-beta3/lib/SyntheticClipboardEvent",
      "npm:react@0.14.0-beta3/lib/SyntheticEvent",
      "npm:react@0.14.0-beta3/lib/SyntheticFocusEvent",
      "npm:react@0.14.0-beta3/lib/SyntheticKeyboardEvent",
      "npm:react@0.14.0-beta3/lib/SyntheticMouseEvent",
      "npm:react@0.14.0-beta3/lib/SyntheticDragEvent",
      "npm:react@0.14.0-beta3/lib/SyntheticTouchEvent",
      "npm:react@0.14.0-beta3/lib/SyntheticUIEvent",
      "npm:react@0.14.0-beta3/lib/SyntheticWheelEvent",
      "npm:fbjs@0.1.0-alpha.4/lib/emptyFunction",
      "npm:react@0.14.0-beta3/lib/getEventCharCode",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "npm:fbjs@0.1.0-alpha.4/lib/keyOf",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactDefaultPerf": [
      "npm:react@0.14.0-beta3/lib/DOMProperty",
      "npm:react@0.14.0-beta3/lib/ReactDefaultPerfAnalysis",
      "npm:react@0.14.0-beta3/lib/ReactMount",
      "npm:react@0.14.0-beta3/lib/ReactPerf",
      "npm:fbjs@0.1.0-alpha.4/lib/performanceNow"
    ],
    "npm:react@0.14.0-beta3/lib/ReactDOMServer": [
      "npm:react@0.14.0-beta3/lib/ReactDefaultInjection",
      "npm:react@0.14.0-beta3/lib/ReactServerRendering"
    ],
    "npm:react@0.14.0-beta3/lib/ReactIsomorphic": [
      "npm:react@0.14.0-beta3/lib/ReactChildren",
      "npm:react@0.14.0-beta3/lib/ReactComponent",
      "npm:react@0.14.0-beta3/lib/ReactClass",
      "npm:react@0.14.0-beta3/lib/ReactDOMFactories",
      "npm:react@0.14.0-beta3/lib/ReactElement",
      "npm:react@0.14.0-beta3/lib/ReactElementValidator",
      "npm:react@0.14.0-beta3/lib/ReactPropTypes",
      "npm:react@0.14.0-beta3/lib/Object.assign",
      "npm:react@0.14.0-beta3/lib/onlyChild",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:backbone@1.2.1/backbone": [
      "npm:underscore@1.8.3",
      "github:components/jquery@2.1.4",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:core-js@0.9.18/library/fn/object/get-own-property-descriptor": [
      "npm:core-js@0.9.18/library/modules/$",
      "npm:core-js@0.9.18/library/modules/es6.object.statics-accept-primitives"
    ],
    "npm:core-js@0.9.18/library/modules/es6.object.set-prototype-of": [
      "npm:core-js@0.9.18/library/modules/$.def",
      "npm:core-js@0.9.18/library/modules/$.set-proto"
    ],
    "npm:babel-runtime@5.8.20/helpers/create-class": [
      "npm:babel-runtime@5.8.20/core-js/object/define-property"
    ],
    "github:jspm/nodelibs-process@0.1.1": [
      "github:jspm/nodelibs-process@0.1.1/index"
    ],
    "npm:react@0.14.0-beta3/lib/Danger": [
      "npm:fbjs@0.1.0-alpha.4/lib/ExecutionEnvironment",
      "npm:fbjs@0.1.0-alpha.4/lib/createNodesFromMarkup",
      "npm:fbjs@0.1.0-alpha.4/lib/emptyFunction",
      "npm:fbjs@0.1.0-alpha.4/lib/getMarkupWrap",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactUpdateQueue": [
      "npm:react@0.14.0-beta3/lib/ReactCurrentOwner",
      "npm:react@0.14.0-beta3/lib/ReactElement",
      "npm:react@0.14.0-beta3/lib/ReactInstanceMap",
      "npm:react@0.14.0-beta3/lib/ReactUpdates",
      "npm:react@0.14.0-beta3/lib/Object.assign",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactDOMInput": [
      "npm:react@0.14.0-beta3/lib/ReactDOMIDOperations",
      "npm:react@0.14.0-beta3/lib/LinkedValueUtils",
      "npm:react@0.14.0-beta3/lib/ReactMount",
      "npm:react@0.14.0-beta3/lib/ReactUpdates",
      "npm:react@0.14.0-beta3/lib/Object.assign",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/EnterLeaveEventPlugin": [
      "npm:react@0.14.0-beta3/lib/EventConstants",
      "npm:react@0.14.0-beta3/lib/EventPropagators",
      "npm:react@0.14.0-beta3/lib/SyntheticMouseEvent",
      "npm:react@0.14.0-beta3/lib/ReactMount",
      "npm:fbjs@0.1.0-alpha.4/lib/keyOf"
    ],
    "npm:react@0.14.0-beta3/lib/ReactInjection": [
      "npm:react@0.14.0-beta3/lib/DOMProperty",
      "npm:react@0.14.0-beta3/lib/EventPluginHub",
      "npm:react@0.14.0-beta3/lib/ReactComponentEnvironment",
      "npm:react@0.14.0-beta3/lib/ReactClass",
      "npm:react@0.14.0-beta3/lib/ReactEmptyComponent",
      "npm:react@0.14.0-beta3/lib/ReactBrowserEventEmitter",
      "npm:react@0.14.0-beta3/lib/ReactNativeComponent",
      "npm:react@0.14.0-beta3/lib/ReactDOMComponent",
      "npm:react@0.14.0-beta3/lib/ReactPerf",
      "npm:react@0.14.0-beta3/lib/ReactRootIndex",
      "npm:react@0.14.0-beta3/lib/ReactUpdates"
    ],
    "npm:react@0.14.0-beta3/lib/ReactReconcileTransaction": [
      "npm:react@0.14.0-beta3/lib/CallbackQueue",
      "npm:react@0.14.0-beta3/lib/PooledClass",
      "npm:react@0.14.0-beta3/lib/ReactBrowserEventEmitter",
      "npm:react@0.14.0-beta3/lib/ReactInputSelection",
      "npm:react@0.14.0-beta3/lib/Transaction",
      "npm:react@0.14.0-beta3/lib/Object.assign"
    ],
    "npm:backbone@1.2.1": [
      "npm:backbone@1.2.1/backbone"
    ],
    "npm:babel-runtime@5.8.20/core-js/object/get-own-property-descriptor": [
      "npm:core-js@0.9.18/library/fn/object/get-own-property-descriptor"
    ],
    "npm:core-js@0.9.18/library/fn/object/set-prototype-of": [
      "npm:core-js@0.9.18/library/modules/es6.object.set-prototype-of",
      "npm:core-js@0.9.18/library/modules/$"
    ],
    "npm:fbjs@0.1.0-alpha.4/lib/invariant": [
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/DOMChildrenOperations": [
      "npm:react@0.14.0-beta3/lib/Danger",
      "npm:react@0.14.0-beta3/lib/ReactMultiChildUpdateTypes",
      "npm:react@0.14.0-beta3/lib/setInnerHTML",
      "npm:react@0.14.0-beta3/lib/setTextContent",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactMount": [
      "npm:react@0.14.0-beta3/lib/DOMProperty",
      "npm:react@0.14.0-beta3/lib/ReactBrowserEventEmitter",
      "npm:react@0.14.0-beta3/lib/ReactCurrentOwner",
      "npm:react@0.14.0-beta3/lib/ReactElement",
      "npm:react@0.14.0-beta3/lib/ReactEmptyComponent",
      "npm:react@0.14.0-beta3/lib/ReactInstanceHandles",
      "npm:react@0.14.0-beta3/lib/ReactInstanceMap",
      "npm:react@0.14.0-beta3/lib/ReactMarkupChecksum",
      "npm:react@0.14.0-beta3/lib/ReactPerf",
      "npm:react@0.14.0-beta3/lib/ReactReconciler",
      "npm:react@0.14.0-beta3/lib/ReactUpdateQueue",
      "npm:react@0.14.0-beta3/lib/ReactUpdates",
      "npm:fbjs@0.1.0-alpha.4/lib/emptyObject",
      "npm:fbjs@0.1.0-alpha.4/lib/containsNode",
      "npm:react@0.14.0-beta3/lib/instantiateReactComponent",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "npm:react@0.14.0-beta3/lib/setInnerHTML",
      "npm:react@0.14.0-beta3/lib/shouldUpdateReactComponent",
      "npm:react@0.14.0-beta3/lib/validateDOMNesting",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactDOMComponent": [
      "npm:react@0.14.0-beta3/lib/AutoFocusUtils",
      "npm:react@0.14.0-beta3/lib/CSSPropertyOperations",
      "npm:react@0.14.0-beta3/lib/DOMProperty",
      "npm:react@0.14.0-beta3/lib/DOMPropertyOperations",
      "npm:react@0.14.0-beta3/lib/EventConstants",
      "npm:react@0.14.0-beta3/lib/ReactBrowserEventEmitter",
      "npm:react@0.14.0-beta3/lib/ReactComponentBrowserEnvironment",
      "npm:react@0.14.0-beta3/lib/ReactDOMButton",
      "npm:react@0.14.0-beta3/lib/ReactDOMInput",
      "npm:react@0.14.0-beta3/lib/ReactDOMOption",
      "npm:react@0.14.0-beta3/lib/ReactDOMSelect",
      "npm:react@0.14.0-beta3/lib/ReactDOMTextarea",
      "npm:react@0.14.0-beta3/lib/ReactMount",
      "npm:react@0.14.0-beta3/lib/ReactMultiChild",
      "npm:react@0.14.0-beta3/lib/ReactPerf",
      "npm:react@0.14.0-beta3/lib/ReactUpdateQueue",
      "npm:react@0.14.0-beta3/lib/Object.assign",
      "npm:react@0.14.0-beta3/lib/escapeTextContentForBrowser",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "npm:react@0.14.0-beta3/lib/isEventSupported",
      "npm:fbjs@0.1.0-alpha.4/lib/keyOf",
      "npm:fbjs@0.1.0-alpha.4/lib/shallowEqual",
      "npm:react@0.14.0-beta3/lib/validateDOMNesting",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactDefaultInjection": [
      "npm:react@0.14.0-beta3/lib/BeforeInputEventPlugin",
      "npm:react@0.14.0-beta3/lib/ChangeEventPlugin",
      "npm:react@0.14.0-beta3/lib/ClientReactRootIndex",
      "npm:react@0.14.0-beta3/lib/DefaultEventPluginOrder",
      "npm:react@0.14.0-beta3/lib/EnterLeaveEventPlugin",
      "npm:fbjs@0.1.0-alpha.4/lib/ExecutionEnvironment",
      "npm:react@0.14.0-beta3/lib/HTMLDOMPropertyConfig",
      "npm:react@0.14.0-beta3/lib/ReactBrowserComponentMixin",
      "npm:react@0.14.0-beta3/lib/ReactComponentBrowserEnvironment",
      "npm:react@0.14.0-beta3/lib/ReactDefaultBatchingStrategy",
      "npm:react@0.14.0-beta3/lib/ReactDOMComponent",
      "npm:react@0.14.0-beta3/lib/ReactDOMIDOperations",
      "npm:react@0.14.0-beta3/lib/ReactDOMTextComponent",
      "npm:react@0.14.0-beta3/lib/ReactEventListener",
      "npm:react@0.14.0-beta3/lib/ReactInjection",
      "npm:react@0.14.0-beta3/lib/ReactInstanceHandles",
      "npm:react@0.14.0-beta3/lib/ReactMount",
      "npm:react@0.14.0-beta3/lib/ReactReconcileTransaction",
      "npm:react@0.14.0-beta3/lib/SelectEventPlugin",
      "npm:react@0.14.0-beta3/lib/ServerReactRootIndex",
      "npm:react@0.14.0-beta3/lib/SimpleEventPlugin",
      "npm:react@0.14.0-beta3/lib/SVGDOMPropertyConfig",
      "npm:react@0.14.0-beta3/lib/ReactDefaultPerf",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "scripts/models": [
      "npm:backbone@1.2.1"
    ],
    "npm:babel-runtime@5.8.20/helpers/get": [
      "npm:babel-runtime@5.8.20/core-js/object/get-own-property-descriptor"
    ],
    "npm:babel-runtime@5.8.20/core-js/object/set-prototype-of": [
      "npm:core-js@0.9.18/library/fn/object/set-prototype-of"
    ],
    "npm:react@0.14.0-beta3/lib/DOMProperty": [
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactDOMIDOperations": [
      "npm:react@0.14.0-beta3/lib/CSSPropertyOperations",
      "npm:react@0.14.0-beta3/lib/DOMChildrenOperations",
      "npm:react@0.14.0-beta3/lib/DOMPropertyOperations",
      "npm:react@0.14.0-beta3/lib/ReactMount",
      "npm:react@0.14.0-beta3/lib/ReactPerf",
      "npm:fbjs@0.1.0-alpha.4/lib/invariant",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "scripts/common": [
      "scripts/models"
    ],
    "npm:babel-runtime@5.8.20/helpers/inherits": [
      "npm:babel-runtime@5.8.20/core-js/object/create",
      "npm:babel-runtime@5.8.20/core-js/object/set-prototype-of"
    ],
    "npm:react@0.14.0-beta3/lib/DOMPropertyOperations": [
      "npm:react@0.14.0-beta3/lib/DOMProperty",
      "npm:react@0.14.0-beta3/lib/quoteAttributeValueForBrowser",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/ReactComponentBrowserEnvironment": [
      "npm:react@0.14.0-beta3/lib/ReactDOMIDOperations",
      "npm:react@0.14.0-beta3/lib/ReactMount",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "scripts/Slider": [
      "npm:babel-runtime@5.8.20/helpers/get",
      "npm:babel-runtime@5.8.20/helpers/inherits",
      "npm:babel-runtime@5.8.20/helpers/create-class",
      "npm:babel-runtime@5.8.20/helpers/class-call-check",
      "scripts/utils",
      "npm:react@0.14.0-beta3",
      "github:leongersen/noUiSlider@8.0.2/nouislider"
    ],
    "npm:react@0.14.0-beta3/lib/ReactDOMTextComponent": [
      "npm:react@0.14.0-beta3/lib/DOMPropertyOperations",
      "npm:react@0.14.0-beta3/lib/ReactComponentBrowserEnvironment",
      "npm:react@0.14.0-beta3/lib/ReactDOMComponent",
      "npm:react@0.14.0-beta3/lib/Object.assign",
      "npm:react@0.14.0-beta3/lib/escapeTextContentForBrowser",
      "npm:react@0.14.0-beta3/lib/validateDOMNesting",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "scripts/accountScreen": [
      "npm:react@0.14.0-beta3",
      "scripts/common",
      "scripts/utils",
      "scripts/Slider",
      "github:nnnick/Chart.js@1.0.2"
    ],
    "npm:react@0.14.0-beta3/lib/ReactDOM": [
      "npm:react@0.14.0-beta3/lib/ReactCurrentOwner",
      "npm:react@0.14.0-beta3/lib/ReactDOMTextComponent",
      "npm:react@0.14.0-beta3/lib/ReactDefaultInjection",
      "npm:react@0.14.0-beta3/lib/ReactInstanceHandles",
      "npm:react@0.14.0-beta3/lib/ReactMount",
      "npm:react@0.14.0-beta3/lib/ReactPerf",
      "npm:react@0.14.0-beta3/lib/ReactReconciler",
      "npm:react@0.14.0-beta3/lib/ReactUpdates",
      "npm:react@0.14.0-beta3/lib/findDOMNode",
      "npm:react@0.14.0-beta3/lib/renderSubtreeIntoContainer",
      "npm:fbjs@0.1.0-alpha.4/lib/warning",
      "npm:fbjs@0.1.0-alpha.4/lib/ExecutionEnvironment",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3/lib/React": [
      "npm:react@0.14.0-beta3/lib/ReactDOM",
      "npm:react@0.14.0-beta3/lib/ReactDOMServer",
      "npm:react@0.14.0-beta3/lib/ReactIsomorphic",
      "npm:react@0.14.0-beta3/lib/Object.assign"
    ],
    "npm:react@0.14.0-beta3/react": [
      "npm:react@0.14.0-beta3/lib/React",
      "npm:react@0.14.0-beta3/lib/Object.assign",
      "npm:react@0.14.0-beta3/lib/deprecated",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:react@0.14.0-beta3": [
      "npm:react@0.14.0-beta3/react"
    ],
    "scripts/accountapp": [
      "scripts/csrf",
      "npm:react@0.14.0-beta3",
      "scripts/accountScreen",
      "scripts/common"
    ]
  }
});

System.config({
  "map": {
    "babel": "npm:babel-core@5.8.22",
    "babel-runtime": "npm:babel-runtime@5.8.20",
    "backbone": "npm:backbone@1.2.1",
    "bootstrap": "github:twbs/bootstrap@3.3.5",
    "chart": "github:nnnick/Chart.js@1.0.2",
    "clean-css": "npm:clean-css@3.3.9",
    "core-js": "npm:core-js@0.9.18",
    "css": "github:systemjs/plugin-css@0.1.13",
    "jquery": "github:components/jquery@2.1.4",
    "kenwheeler/slick": "github:kenwheeler/slick@1.5.8",
    "leongersen/noUiSlider": "github:leongersen/noUiSlider@8.0.2",
    "react": "npm:react@0.14.0-beta3",
    "sockjs/sockjs-client": "github:sockjs/sockjs-client@1.0.3",
    "underscore": "npm:underscore@1.8.3",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.4.2"
    },
    "github:jspm/nodelibs-domain@0.1.0": {
      "domain-browser": "npm:domain-browser@1.1.4"
    },
    "github:jspm/nodelibs-events@0.1.1": {
      "events": "npm:events@1.0.2"
    },
    "github:jspm/nodelibs-http@1.7.1": {
      "Base64": "npm:Base64@0.2.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "github:jspm/nodelibs-https@0.1.0": {
      "https-browserify": "npm:https-browserify@0.0.0"
    },
    "github:jspm/nodelibs-os@0.1.0": {
      "os-browserify": "npm:os-browserify@0.1.2"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "github:jspm/nodelibs-stream@0.1.0": {
      "stream-browserify": "npm:stream-browserify@1.0.0"
    },
    "github:jspm/nodelibs-url@0.1.0": {
      "url": "npm:url@0.10.3"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:twbs/bootstrap@3.3.5": {
      "jquery": "github:components/jquery@2.1.4"
    },
    "npm:amdefine@1.0.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "module": "github:jspm/nodelibs-module@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:asap@2.0.3": {
      "domain": "github:jspm/nodelibs-domain@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:babel-runtime@5.8.20": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:backbone@1.2.1": {
      "process": "github:jspm/nodelibs-process@0.1.1",
      "underscore": "npm:underscore@1.8.3"
    },
    "npm:buffer@3.4.2": {
      "base64-js": "npm:base64-js@0.0.8",
      "ieee754": "npm:ieee754@1.1.6",
      "is-array": "npm:is-array@1.0.1"
    },
    "npm:clean-css@3.3.9": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "commander": "npm:commander@2.8.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "os": "github:jspm/nodelibs-os@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "source-map": "npm:source-map@0.4.4",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:commander@2.8.1": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "graceful-readlink": "npm:graceful-readlink@1.0.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-js@0.9.18": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:core-js@1.0.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:core-util-is@1.0.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:domain-browser@1.1.4": {
      "events": "github:jspm/nodelibs-events@0.1.1"
    },
    "npm:envify@3.4.0": {
      "jstransform": "npm:jstransform@10.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "through": "npm:through@2.3.8"
    },
    "npm:esprima-fb@13001.1001.0-dev-harmony-fb": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:fbjs@0.1.0-alpha.4": {
      "core-js": "npm:core-js@1.0.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "promise": "npm:promise@7.0.4",
      "whatwg-fetch": "npm:whatwg-fetch@0.9.0"
    },
    "npm:graceful-readlink@1.0.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2"
    },
    "npm:https-browserify@0.0.0": {
      "http": "github:jspm/nodelibs-http@1.7.1"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:jstransform@10.1.0": {
      "base62": "npm:base62@0.1.1",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "esprima-fb": "npm:esprima-fb@13001.1001.0-dev-harmony-fb",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "source-map": "npm:source-map@0.1.31"
    },
    "npm:os-browserify@0.1.2": {
      "os": "github:jspm/nodelibs-os@0.1.0"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:promise@7.0.4": {
      "asap": "npm:asap@2.0.3",
      "fs": "github:jspm/nodelibs-fs@0.1.2"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:react@0.14.0-beta3": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "envify": "npm:envify@3.4.0",
      "fbjs": "npm:fbjs@0.1.0-alpha.4",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:readable-stream@1.1.13": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "stream-browserify": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:source-map@0.1.31": {
      "amdefine": "npm:amdefine@1.0.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:source-map@0.4.4": {
      "amdefine": "npm:amdefine@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "readable-stream": "npm:readable-stream@1.1.13"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:through@2.3.8": {
      "process": "github:jspm/nodelibs-process@0.1.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0"
    },
    "npm:url@0.10.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "punycode": "npm:punycode@1.3.2",
      "querystring": "npm:querystring@0.2.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

