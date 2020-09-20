<template>
    <div :title="config.toolTip" @click="clickOuterDiv">
        <p v-if="config.title">
            {{ config.title }}
        </p>
        <vue-svg-gauge 
            :start-angle="config.startAngle"
            :end-angle="config.endAngle"
            :value="value || config.value || 0"
            :separator-step="config.separatorStep"
            :min="config.min"
            :max="config.max"
            :gauge-color="config.gaugeColor"
            :scale-interval="config.scaleInterval"
        ><slot /></vue-svg-gauge>
        <p v-if="config.figure">{{ config.figure }}</p>
    </div>
</template>

<script src="../uibuilder/vendor/uibuilder-vuejs-component-extras/node_modules/vue-svg-gauge/dist/vue-svg-gauge.min.js"></script>
<!-- <script src="https://unpkg.com/vue-svg-gauge@latest/dist/vue-svg-gauge.min.js"></script> -->

<script scoped>
    /** Use vue-svg-gauge component module
     * @see https://github.com/hellocomet/vue-svg-gauge
     * @see https://github.com/TotallyInformation/node-red-contrib-uibuilder/wiki/Integrating-vue-svg-gauge
     */

    //import { VueSvgGauge } from 'vue-svg-gauge'

    module.exports = {
        //export default {
        name: 'gauge',

        /** Note that props with dashes in name have to be referenced as camel case in JS */
        props: {
            'value': Number,
            'config': {
                type: Object,
                default: function() { return {
                    'title': 'uibuilder Gauge',
                    'toolTip': undefined,
                    'figure': undefined,
                    'clickEvents': false,

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

        data: function() { return {
        }}, // -- End of data -- //

        computed: {
        }, // -- End of computed -- //

        methods: {
            // https://stackoverflow.com/questions/48250832/programmatically-bind-custom-events-for-dynamic-components-in-vuejs/48251122
            // evtHandler: function(e){
            //     console.log('evtHandler', e)
            // },
            clickOuterDiv: function(e){
                if ( this.config.clickEvents !== true ) return
                
                console.log('clickOuterDiv - e', e)
                console.log('clickOuterDiv - this', this)

                if ( window.uibuilder ) uibuilder.send({
                    'topic': 'gauge clicked',
                    //'payload': e,  // for some reason, just passing e only gives e.isTrusted and nothing else
                    'payload': {
                        x: e.x, y: e.y,
                        clientX: e.clientX, clientY: e.clientY, pageX: e.pageX, pageY: e.pageY,  offsetX: e.offsetX, offsetY: e.offsetY,  layerX: e.layerX, layerY: e.layerY,  screenX: e.screenX, screenY: e.screenY, 

                        altKey: e.altKey, ctrlKey: e.ctrlKey, metaKey: e.metaKey, shiftKey: e.shiftKey,

                        componentRef: this.$vnode.data.ref,
                        componentTag: this.$vnode.componentOptions.tag,
                        eventType: e.type,
                    },
                })
            },
        }, // -- End of methods -- //

        // Available hooks: init,mounted,updated,destroyed
        mounted: function(){
            const myComponent = this

            console.log(myComponent)

            // Check if uibuilder is being used
            if ( window.uibuilder ) {
                console.log('GREAT! You are using uibuilder, thanks!')

                // Dynamically add event handler
                //myComponent.$el.addEventListener('click', myComponent.clickOuterDiv)
            }
        },
    }
</script>

<style>
</style>