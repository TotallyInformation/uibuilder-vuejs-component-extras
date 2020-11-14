<template>
    <figure :title="config.toolTip" @click="clickOuter">
        <figcaption v-if="config.header" class="uibg-t">
            <span v-html="config.header" />
        </figcaption>
        <vue-svg-gauge
            :style="config.style"
            :start-angle="config.startAngle"
            :end-angle="config.endAngle"
            :value="value || config.value || 0"
            :separator-step="config.separatorStep"
            :min="config.min"
            :max="config.max"
            :gauge-color="config.gaugeColor"
            :scale-interval="config.scaleInterval"
        >
            <slot />
        </vue-svg-gauge>
        <figcaption v-if="config.caption" class="uibg-b">
            <span v-html="config.caption" />
        </figcaption>
    </figure>
</template>

<style scoped>
    figcaption {
        text-align: center;
    }
    .uibg-t {
        margin-bottom: 1rem;
    }
    .uibg-b {
        margin-top: 1rem;
    }
</style>

<script>

/** Use vue-svg-gauge component module
 * @see https://github.com/hellocomet/vue-svg-gauge
 * @see https://github.com/TotallyInformation/node-red-contrib-uibuilder/wiki/Integrating-vue-svg-gauge
 */

import VueSvgGauge from 'vue-svg-gauge'

export default {
    name: 'Gauge',

    components: {
        VueSvgGauge
    }, // --- End of components --- //

    /** Note that props with dashes in name have to be referenced as camel case in JS */
    props: {
        'value': Number,
        /** Use to pass any of vue-svg-gauge properties
         * @param {gaugeOptions} config
         * 
         * @param {String} [config.header] If present, a para is added above the chart. Default: 'uibuilder Gauge',
         * @param {String} [config.toolTip] If present, adds a title tooltip to the outer element. Default: undefined,
         * @param {String} [config.caption] If present, a para is added below the chart. Default: undefined,
         * @param {String} [config.clickEvents] If true, sends data back to uibuilder if clicked. Default: false,
         * @param {String} [config.style] CSS styles to override the gauge style. Default: "height:15rem;",
         * 
         * @param {Number} [config.value] Gauge value. Optional, use main value prop normally. Default: 0
         * @param {Number} [config.min] Default: 0,
         * @param {Number} [config.max] Default: 100,
         * @param {Number} [config.startAngle] Default: -90,
         * @param {Number} [config.endAngle] Default: 90,
         * @param {Number} [config.innerRadius] Default: 60,
         * @param {Number} [config.separatorStep] Default: 10,
         * @param {Number} [config.separatorThickness] Default: 4,
         * @param {Object[]} [config.gaugeColor] Default: [{ offset: 0, color: '#347AB0' }, { offset: 100, color: '#8CDFAD' }],
         * @param {Number} [config.gaugeColor[].offset] Starting value for the colour.
         * @param {Number} [config.gaugeColor[].color]  Colour to apply at starting offset. Any valid CSS colour specification.
         * @param {String} [config.baseColor] Default: '#DDDDDD',
         * @param {Number} [config.scaleInterval] Default: 5,
         * @param {Number} [config.transitionDuration] Default: 1500,
         * @param {String} [config.easing] Default: 'Circular.Out', @see https://github.com/tweenjs/tween.js/
         */
        'config': {
            type: Object,
            default: function() { return {
                'header': undefined,
                'toolTip': undefined,
                'caption': undefined,
                'clickEvents': false,
                'style': 'height:15rem;', // fix the default height to something reasonable

                /** Native vue-svg-gauge props, @see https://github.com/hellocomet/vue-svg-gauge#props
                 * Native defaults:
                 * 'value': 70,
                 * 'min': 0,
                 * 'max': 100,
                 * 'start-angle': -90,
                 * 'end-angle': 90,
                 * 'inner-radius': 60,
                 * 'separator-step': 10,
                 * 'separator-thickness': 4,
                 * 'gauge-color': [{ offset: 0, color: '#347AB0' }, { offset: 100, color: '#8CDFAD' }],
                 * 'base-color': '#DDDDDD',
                 * 'scale-interval': 5,
                 * 'transition-duration': 1500,
                 * 'easing': 'Circular.Out',
                 *    For animation settings, @see https://github.com/tweenjs/tween.js/
                 */
                'value': 0,
            } },
        },
    }, // -- End of props -- //

    methods: {
        /** Handle click events
         * @param {Object} e DOM/Vue event data
         */
        clickOuter: function(e){
            // Only respond to clicks if needed
            if ( this.config.clickEvents !== true ) return
            
            /** If this component is being used with Node-RED/uibuilder, Send a msg back to Node-RED. */
            if ( window.uibuilder ) uibuilder.send({
                'topic': 'gauge clicked',
                // For some reason, just passing e only gives e.isTrusted and nothing else
                'payload': {
                    componentRef: this.$vnode.data.ref,
                    componentTag: this.$vnode.componentOptions.tag,
                    eventType: e.type,

                    x: e.x, y: e.y,
                    clientX: e.clientX, clientY: e.clientY, pageX: e.pageX, pageY: e.pageY,  offsetX: e.offsetX, offsetY: e.offsetY,  layerX: e.layerX, layerY: e.layerY,  screenX: e.screenX, screenY: e.screenY, 

                    altKey: e.altKey, ctrlKey: e.ctrlKey, metaKey: e.metaKey, shiftKey: e.shiftKey,
                },
            })
        },
    }, // -- End of methods -- //

}

</script>

<!-- One of the following has to be loaded:
     <script src="../uibuilder/vendor/uibuilder-vuejs-component-extras/node_modules/vue-svg-gauge/dist/vue-svg-gauge.min.js"></script>
     <script src="https://unpkg.com/vue-svg-gauge@latest/dist/vue-svg-gauge.min.js"></script> 
     Add one of them to your index.html file
    -->
