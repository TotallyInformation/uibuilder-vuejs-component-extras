# SVG Gauge for Vuejs/uibuilder/Node-RED

Uses the excellent [vue-svg-gauge](https://github.com/hellocomet/vue-svg-gauge) component.

However, that component is wrapped in an outer component that helps make it data-driven
and so more suited to being controlled by data sent from Node-RED via uibuilder.

It still works without uibuilder though.

## Installation

Currently, see the uibuilder-vuejs-component-extras readme. Eventually this component will
end up in its own module.

### Examples

There are two versions of the examples. The first uses [http-vue-loader](https://github.com/FranckFreiburger/http-vue-loader)
which must be installed via the uibuilder module installer prior to use. The second only works with modern browsers and uses
the newer [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) specification.

## Including the component in your front-end code

Currently, see the uibuilder-vuejs-component-extras readme. Eventually this component will
end up in its own module.

## Data-driven usage

Assuming that you've managed to load the component and if you are using uibuilder, 
you can simply use the following minimal HTML to add an instance to your web page.

```html
<gauge ref="gauge1" />
```
That will display with default settings and a value of 0 until you have sent it some data.

Note that you can still use the other props as shown in the [next section](#vuejs-only-usage). These can be useful if you want to 
have default values before the first msg is sent.

To send a value to the gauge, all you need in Node-RED is to send a msg like the following to your uibuilder Node.

```javascript
{
    "topic": "OptionalTopic",    // Optional
    "payload": 50,               // the value to be shown on the gauge
    "_uib": {
        "componentRef":"gauge1", // must be the same as the "ref" attribute in your HTML

        "options": {             // You don't need to include this if all you are sending is the value
            /**
             * "options" can contain any of the following, all options are optional:
             *
             * These options are specific to this component:
             *
             * @param {String} [header] If present, a para is added above the chart. Default: 'uibuilder Gauge',
             * @param {String} [toolTip] If present, adds a title tooltip to the outer element. Default: undefined,
             * @param {String} [caption] If present, a para is added below the chart. Default: undefined,
             * @param {String} [clickEvents] If true, sends data back to uibuilder if clicked. Default: false,
             * @param {String} [style] CSS styles to override the gauge style. Default: "height:15rem;",
             *
             * The remaining options are properties used by the SVG Gauge component:
             * 
             * @param {Number} [value] Gauge value. Optional, use main value prop normally. Default: 0
             * @param {Number} [min] Default: 0,
             * @param {Number} [max] Default: 100,
             * @param {Number} [startAngle] Default: -90,
             * @param {Number} [endAngle] Default: 90,
             * @param {Number} [innerRadius] Default: 60,
             * @param {Number} [separatorStep] Default: 10,
             * @param {Number} [separatorThickness] Default: 4,
             * @param {Object[]} [gaugeColor] Default: [{ offset: 0, color: '#347AB0' }, { offset: 100, color: '#8CDFAD' }],
             * @param {Number} [gaugeColor[].offset] Starting value for the colour.
             * @param {Number} [gaugeColor[].color]  Colour to apply at starting offset. Any valid CSS colour specification.
             * @param {String} [baseColor] Default: '#DDDDDD',
             * @param {Number} [scaleInterval] Default: 5,
             * @param {Number} [transitionDuration] Default: 1500,
             * @param {String} [easing] Default: 'Circular.Out', @see https://github.com/tweenjs/tween.js/
             */
        }
    }
}
```

Note the `clickEvents` flag. If this is set to `true` when using uibuilder, clicking on the gauge will send a message back to Node-RED with a payload in the following format:

```javascript
{
    // Shows which component reference (id) was clicked
    "componentRef":"gauge1",
    // Shows which component type (the HTML tag) was clicked
    "componentTag":"gauge",
    // Shows what event was triggered (only a click is valid for the gauge)
    "eventType":"click",
    // Show various positions of where the click took place
    "x": 708 ,"y": 621, "clientX": 708, "clientY": 621, "pageX": 708, "pageY": 621, "offsetX": 412, "offsetY": 84, "layerX": 432, "layerY": 144, "screenX": 708, "screenY": 724,
    // Shows which variation keys were held down when the click took place
    "altKey": false, "ctrlKey": false, "metaKey": false, "shiftKey": false,
}
```

This is all taken from the DOM event and VueJS component data.

## VueJS only usage

You can also use the component without uibuilder or in a hybrid fashion 
(sending some data from Node-RED and coding some in your Vue app as defaults for example).

```html
<gauge
    ref="anaothergauge"
    value="50"
    <!-- The "config" data here is the same as the "options" data shown above 
         except that you have to serialise it if entering it in html - better to pass it from a data object
      -->
    :config="gauge1Options" 
>
    <div class="gaugeInner">
        This text appears "within" the gauge using the gauges slot. It is obviously optional.
        The slot covers the whole gauge by default so you will almost certainly want to wrap
        text in a `div` and apply CSS styling.

        If using bootstrap-vue (included in the default install of uibuilder), you can use bootstrap styling and bootstrap-vue components.
    </div>
</gauge>
```