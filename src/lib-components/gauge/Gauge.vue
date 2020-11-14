<template>
    <figure :title="toolTip" @click="clickOuter">
        <figcaption v-if="header" class="uibgauge-header">
            <span v-html="header" />
        </figcaption>
            
        <div class="gauge" :style="style"><svg
            v-if="height"
            :viewBox="`0 0 ${RADIUS * 2} ${height}`"
            height="100%"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <!-- This puts an inner shadow on the empty part of gauge -->
                <filter :id="`innershadow-${_uid}`">
                    <feFlood flood-color="#c7c6c6" />
                    <feComposite in2="SourceAlpha" operator="out" />
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite operator="atop" in2="SourceGraphic" />
                </filter>

                <!-- Determine the gradient color on the full part of the gauge -->
                <linearGradient v-if="hasGradient" :id="`gaugeGradient-${_uid}`">
                    <stop
                        v-for="(color, index) in gaugeColors"
                        :key="`${color.color}-${index}`"
                        :offset="`${color.offset}%`"
                        :stop-color="color.color"
                    />
                </linearGradient>

                <mask :id="`innerCircle-${_uid}`">
                    <!-- Mask to make sure only the part inside the circle is visible -->
                    <!-- RADIUS - 0.5 to avoid any weird display -->
                    <circle
                        :r="RADIUS - 0.5"
                        :cx="X_CENTER"
                        :cy="Y_CENTER"
                        fill="white"
                    />

                    <!-- Mask to remove the inside of the gauge -->
                    <circle :r="innerRadius" :cx="X_CENTER" :cy="Y_CENTER" fill="black" />

                    <template v-if="separatorPaths">
                        <!-- Mask for each separator -->
                        <path
                            v-for="(separator, index) in separatorPaths"
                            :key="index"
                            :d="separator"
                            fill="black"
                        />
                    </template>
                </mask>
            </defs>

            <g :mask="`url(#innerCircle-${_uid})`">
                <!-- Draw a circle if the full gauge has a 360° angle, otherwise draw a path -->
                <circle
                    v-if="isCircle"
                    :r="RADIUS"
                    :cx="X_CENTER"
                    :cy="Y_CENTER"
                    :fill="hasGradient ? `url(#gaugeGradient-${_uid})` : gaugeColor"
                />
                <path
                    v-else
                    :d="basePath"
                    :fill="hasGradient ? `url(#gaugeGradient-${_uid})` : gaugeColor"
                />

                <!-- Draw a circle if the empty gauge has a 360° angle, otherwise draw a path -->
                <circle
                    v-if="value === min && isCircle"
                    :r="RADIUS"
                    :cx="X_CENTER"
                    :cy="Y_CENTER"
                    :fill="baseColor"
                />
                <path
                    v-else
                    :d="gaugePath"
                    :fill="baseColor"
                    :filter="`url(#innershadow-${_uid})`"
                />
            </g>

            <template v-if="scaleLines">
                <!-- Display a line for each tick of the scale -->
                <line
                    v-for="(line, index) in scaleLines"
                    :key="`${line.xE}-${index}`"
                    :x1="line.xS"
                    :y1="line.yS"
                    :x2="line.xE"
                    :y2="line.yE"
                    stroke-width="1"
                    :stroke="baseColor"
                />
            </template>

            <!-- This allow to display html inside the svg -->
            <foreignObject x="0" y="0" width="100%" :height="height">
                <slot />
            </foreignObject>
        </svg></div>

        <!-- <vue-svg-gauge
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
        </vue-svg-gauge> -->

        <figcaption v-if="caption" class="uibgauge-caption">
            <span v-html="caption" />
        </figcaption>
    </figure>
</template>

<script>
import TWEEN from '@tweenjs/tween.js'
import _get from 'lodash/get'

// Main radius of the gauge
const RADIUS = 100

// Coordinates of the center based on the radius
const X_CENTER = 100
const Y_CENTER = 100

/** Turn polar coordinate to cartesians
 * @param   {Number} centerX - abscisse of the center
 * @param   {Number} centerY - ordinate of the center
 * @param   {Number} radius  - radius of the circle
 * @param   {Number} angle   - angle in degres
 * @returns {String}         - d property of the path
 */
function polarToCartesian(radius, angle) {
    const angleInRadians = ((angle - 90) * Math.PI) / 180

    return {
            x: X_CENTER + radius * Math.cos(angleInRadians),
            y: Y_CENTER + radius * Math.sin(angleInRadians),
    }
}

/** Describe a gauge path according
 * @param   {Number} radius
 * @param   {Number} startAngle - in degre
 * @param   {Number} endAngle   - in degre
 * @returns {String}            - d property of the path
 */
function describePath(radius, startAngle, endAngle) {
    const start = polarToCartesian(radius, endAngle)
    const end = polarToCartesian(radius, startAngle)

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

    const d = [
            'M',
            start.x,
            start.y,
            'A',
            radius,
            radius,
            0,
            largeArcFlag,
            0,
            end.x,
            end.y,
            'L',
            X_CENTER,
            Y_CENTER, //Y_CENTERER,
    ].join(' ')

    return d
}

export default {
    name: 'Gauge',

    props: {
        // 'config': {
        //     type: Object,
        //     default: function() { return {
        //         'header': undefined,
        //         'toolTip': undefined,
        //         'caption': undefined,
        //         'clickEvents': false,
        //         'style': 'height:15rem;', // fix the default height to something reasonable

        //         /** Native vue-svg-gauge props, @see https://github.com/hellocomet/vue-svg-gauge#props
        //          * Native defaults:
        //          * 'value': 70,
        //          * 'min': 0,
        //          * 'max': 100,
        //          * 'start-angle': -90,
        //          * 'end-angle': 90,
        //          * 'inner-radius': 60,
        //          * 'separator-step': 10,
        //          * 'separator-thickness': 4,
        //          * 'gauge-color': [{ offset: 0, color: '#347AB0' }, { offset: 100, color: '#8CDFAD' }],
        //          * 'base-color': '#DDDDDD',
        //          * 'scale-interval': 5,
        //          * 'transition-duration': 1500,
        //          * 'easing': 'Circular.Out',
        //          *    For animation settings, @see https://github.com/tweenjs/tween.js/
        //          */
        //         'value': 0,
        //     } },
        // },

        /**
         * Gauge value
         */
        value: {
            type: Number,
            default: 70,
        },
        /**
         * Gauge min value
         */
        min: {
            type: Number,
            default: 0,
        },
        /**
         * Gauge max value
         */
        max: {
            type: Number,
            default: 100,
        },
        /**
         * Must be between -360 and 360
         * startAngle MUST be inferior to endAngle
         */
        startAngle: {
            type: Number,
            default: -90,
            validator: (value) => {
                if (value < -360 || value > 360) {
                    console.warn(
                        'GaugeChart - props "startAngle" must be between -360 and 360'
                    )
                }
                return true
            },
        },
        /**
         * Must be between -360 and 360
         * startAngle MUST be inferior to endAngle
         */
        endAngle: {
            type: Number,
            default: 90,
            validator: (value) => {
                if (value < -360 || value > 360) {
                    console.warn(
                        'GaugeChart - props "endAngle" must be between -360 and 360'
                    )
                }
                return true
            },
        },
        /**
         * Size of the inner radius between 0 and RADIUS
         * The closer to RADIUS, the thinner the gauge will be
         */
        innerRadius: {
            type: Number,
            default: 60,
            validator: (value) => {
                if (value < 0 || value > 100) {
                    console.warn(
                        `GaugeChart - props "innerRadius" must be between 0 and ${RADIUS}`
                    )
                }
                return true
            },
        },
        /**
         * Separator step, will display a separator each min + (n * separatorStep)
         * Won't display any separator if 0 or null
         */
        separatorStep: {
            type: Number,
            default: 10,
            validator: (value) => {
                if (value !== null && value < 0) {
                    console.warn(
                        'GaugeChart - props "separatorStep" must be null or >= 0'
                    )
                }
                return true
            },
        },
        /**
         * Separator Thickness, unit is in degree
         */
        separatorThickness: {
            type: Number,
            default: 4,
        },
        /**
         * Gauge color. Can be :
         * - a simple color if passed as a 'string'
         * - a gradient if is an array of objects :
         * { offset: percentage where the color starts, color: color to display }
         */
        gaugeColor: {
            type: [Array, String],
            default: () => [
                    { offset: 0, color: '#347AB0' },
                    { offset: 100, color: '#8CDFAD' },
            ],
        },
        /**
         * Color of the base of the gauge
         */
        baseColor: {
            type: String,
            default: '#DDDDDD',
        },
        /**
         * Animation easing option
         * You can check the Tween.js doc here :
         * https://github.com/tweenjs/tween.js/blob/master/docs/user_guide.md
         *
         * There are a few existing function gourped by equation they represent:
         * Linear, Quadratic, Cubic, Quartic, Quintic, Sinusoidal, Exponential,
         * Circular, Elastic, Back and Bounce
         *
         * And then by the easing type: In, Out and InOut.
         * The syntaxe is : equation.easingType
         */
        easing: {
            type: String,
            default: 'Circular.Out',
        },
        /**
         * Scale interval
         * Won't display any scall if 0 or `null`
         */
        scaleInterval: {
            type: Number,
            default: 5,
            validator: (value) => {
                if (value !== null && value < 0) {
                    console.warn(
                        'GaugeChart - props "scaleInterval" must be null or >= 0'
                    )
                }
                return true
            },
        },
        /**
         * Transition duration in ms
         */
        transitionDuration: {
            type: Number,
            default: 1500,
        },
    },

    data() {
        return {
            X_CENTER: X_CENTER,
            Y_CENTER: Y_CENTER,
            RADIUS: RADIUS,
            /**
             * Tweened value for the animation of the gauge
             * Starts at `min`
             * @type {Number}
             */
            tweenedValue: this.min,

            'header': null,
            'toolTip': null,
            'caption': null,
            'clickEvents': false,
            'style': 'height:15rem;', // fix the default height to something reasonable
            'gaugeColors': this.gaugeColor,

        }
    },

    computed: {
        /** Height of the viewbox calculated by getting
         * - the lower y between the center and the start and end angle
         * - (RADIUS * 2) if one of the angle is bigger than 180°
         * @type {Number}
         */
        height() {
            const { endAngle, startAngle } = this
            const { y: yStart } = polarToCartesian(RADIUS, startAngle)
            const { y: yEnd } = polarToCartesian(RADIUS, endAngle)

            return Math.abs(endAngle) <= 180 && Math.abs(startAngle) <= 180
                ? Math.max(Y_CENTER, yStart, yEnd)
                : RADIUS * 2
        },
        /** d property of the path of the base gauge (the colored one)
         * @type {String}
         */
        basePath() {
            const { startAngle, endAngle } = this

            return describePath(RADIUS, startAngle, endAngle)
        },
        /** d property of the gauge according to the value.
         * This gauge will hide a part of the base gauge
         * @type {String}
         */
        gaugePath() {
            const { endAngle, getAngle, tweenedValue } = this

            return describePath(RADIUS, getAngle(tweenedValue), endAngle)
        },
        /** Total angle of the gauge
         * @type {Number}
         */
        totalAngle() {
            const { startAngle, endAngle } = this

            return Math.abs(endAngle - startAngle)
        },
        /** True if the gauge is a full circle
         * @type {Boolean}
         */
        isCircle() {
            return Math.abs(this.totalAngle) === 360
        },
        /** True if the gaugeColor is an array
         * Result in displaying a gradient instead of a simple color
         * @type {Boolean}
         */
        hasGradient() {
            return Array.isArray(this.gaugeColor)
        },
        /** Array of the path of each separator */
        separatorPaths() {
            const {
                separatorStep,
                getAngle,
                min,
                max,
                separatorThickness,
                isCircle,
            } = this

            if (separatorStep > 0) {
                const paths = []
                // If the gauge is a circle, this will add a separator at the start
                let i = isCircle ? min : min + separatorStep

                for (i; i < max; i += separatorStep) {
                    const angle = getAngle(i)
                    const halfAngle = separatorThickness / 2

                    paths.push(
                            describePath(RADIUS + 2, angle - halfAngle, angle + halfAngle)
                    )
                }

                return paths
            }

            return null
        },
        /** Array of line configuration for each scale */
        scaleLines() {
            const { scaleInterval, isCircle, min, max, getAngle, innerRadius } = this

            if (scaleInterval > 0) {
                const lines = []
                // if gauge is a circle, remove the first scale
                let i = isCircle ? min + scaleInterval : min

                for (i; i < max + scaleInterval; i += scaleInterval) {
                    const angle = getAngle(i)
                    const startCoordinate = polarToCartesian(innerRadius - 4, angle)
                    const endCoordinate = polarToCartesian(innerRadius - 8, angle)

                    lines.push({
                        xS: startCoordinate.x,
                        yS: startCoordinate.y,
                        xE: endCoordinate.x,
                        yE: endCoordinate.y,
                    })
                }

                return lines
            }

            return null
        },
    },

    watch: {
        /**
         * Watch the value and tween it to make an animation
         * If value < min, used value will be min
         * If value > max, used value will be max
         */
        value: {
            immediate: true,
            handler(next) {
                const { easing, tweenedValue, min, max, transitionDuration } = this
                let safeValue = next

                if (next < min) {
                    safeValue = min
                }

                if (next > max) {
                    safeValue = max
                }

                function animate() {
                    if (TWEEN.update()) {
                        requestAnimationFrame(animate)
                    }
                }

                new TWEEN.Tween({ tweeningValue: tweenedValue })
                    .to({ tweeningValue: safeValue }, transitionDuration)
                    .easing( _get(TWEEN.Easing, easing))
                        .onUpdate((object) => {
                            this.tweenedValue = object.tweeningValue
                        })
                    .start()

                animate()
            },
        },
    },

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
        }, // --- End of clickOuter --- //

        /** Get an angle for a value
         * @param   {Number} value
         * @returns {Number} angle - in degree
         */
        getAngle(value) {
            const { min, max, startAngle, totalAngle } = this
            // Make sure not to divide by 0
            const totalValue = max - min || 1

            return (value * totalAngle) / totalValue + startAngle
        },

    }, // -- End of methods -- //

} // ---- End of export ---- //
</script>

<style scoped lang="css">
    .gauge {
        width: 100%;
        height: 100%;
    }
    figcaption {
        text-align: center;
    }
    .uibgauge-header {
        margin-bottom: 1rem;
    }
    .uibgauge-caption {
        margin-top: 1rem;
    }
</style>