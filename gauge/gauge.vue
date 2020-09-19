<template>
    <div>
        <p>Gauge</p>
        <vue-svg-gauge
            :start-angle="startAngle"
            :end-angle="endAngle"
            :value="value"
            :separator-step="separatorStep"
            :min="min"
            :max="max"
            :gauge-color="gaugeColor"
            :scale-interval="scaleInterval"
        />
    </div>
</template>

<script src="../uibuilder/vendor/uibuilder-vuejs-component-extras/node_modules/vue-svg-gauge/dist/vue-svg-gauge.min.js"></script>
<!-- <script src="https://unpkg.com/vue-svg-gauge@latest/dist/vue-svg-gauge.min.js"></script> -->

<script>
    /** Use vue-svg-gauge component module
     * @see https://github.com/hellocomet/vue-svg-gauge
     * @see https://github.com/TotallyInformation/node-red-contrib-uibuilder/wiki/Integrating-vue-svg-gauge
     */

    //import { VueSvgGauge } from 'vue-svg-gauge'

    module.exports = {
        //export default {
        name: 'gauge',

        /** Note that props with dashes in name have to be referenced as camel case in JS */
        props: [
            'start-angle',
            'end-angle',
            'value',
            'separator-step',
            'min',
            'max',
            'gauge-color',
            'scale-interval',
        ], // -- End of props -- //

        data: function() { return {
        }}, // -- End of data -- //

        computed: {
        }, // -- End of computed -- //

        methods: {
        }, // -- End of methods -- //

        //   components: {
        //     //VueSvgGauge,
        //     'VueSvgGauge': httpVueLoader('../uibuilder/vendor/uibuilder-vuejs-component-extras/node_modules/vue-svg-gauge/dist/vue-svg-gauge.min.js'),
        //   }
    }
</script>

<style></style>