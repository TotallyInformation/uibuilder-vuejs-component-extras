# SVG Gauge for Vuejs/uibuilder/Node-RED

Uses the excellent [vue-svg-gauge](https://github.com/hellocomet/vue-svg-gauge) component.

However, that component is wrapped in an outer component that helps make it data-driven
and so more suited to being controlled by data sent from Node-RED via uibuilder.

It still works without uibuilder though.

## Installation

Currently, see the uibuilder-vuejs-component-extras readme. Eventually this component will
end up in its own module.

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

To send a value to the gauge, all you need in Node-RED is to send a msg like the following to your uibuilder Node.

```json
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
             * @param {String} [config.title] If present, a para is added above the chart. Default: 'uibuilder Gauge',
             * @param {String} [config.toolTip] If present, adds a title tooltip to the outer element. Default: undefined,
             * @param {String} [config.figure] If present, a para is added below the chart. Default: undefined,
             * @param {String} [config.clickEvents] If true, sends data back to uibuilder if clicked. Default: false,
             *
             * The remaining options are properties used by the SVG Gauge component:
             * 
             * @param {Number} [config.value] Gauge value. Optional, use main value prop normally. Default: 0
             * @param {Number} [config.min] Default: 0,
             * @param {Number} [config.max] Default: 100,
             * @param {Number} [config.startAngle] Default: -90,
             * @param {Number} [config.endAngle] Default: 90,
             * @param {Number} [config.innerRadius] Default: 60,
             * @param {Number} [config.separatorStep] Default: 10,
             * @param {Number} [config.separatorThickness] Default: 4,
             * @param {Array} [config.gaugeColor] Default: [{ offset: 0, color: '#347AB0' }, { offset: 100, color: '#8CDFAD' }],
             * @param {String} [config.baseColor] Default: '#DDDDDD',
             * @param {Number} [config.scaleInterval] Default: 5,
             * @param {Number} [config.transitionDuration] Default: 1500,
             * @param {String} [config.easing] Default: 'Circular.Out', @see https://github.com/tweenjs/tween.js/
             */
        }
    }
}
```

Note the `clickEvents` flag. If this is set to `true` when using uibuilder, clicking on the gauge will send a message back to Node-RED with a payload in the following format:

```json
{
    "x": 708 ,"y": 621, "clientX": 708, "clientY": 621, "pageX": 708, "pageY": 621, "offsetX": 412, "offsetY": 84, "layerX": 432, "layerY": 144, "screenX": 708, "screenY": 724,
    "altKey": false, "ctrlKey": false, "metaKey": false, "shiftKey": false,
    "componentRef":"gauge1",
    "componentTag":"gauge",
    "eventType":"click"
}
```

This is all taken from the DOM event and VueJS component data.

## VueJS only usage

You can also use the component without uibuilder or in a hybrid fashion (sending some data from Node-RED and coding some in your Vue app).

```html
<gauge
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