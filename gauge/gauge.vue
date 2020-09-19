<template>
    <div>
        <p>Gauge</p>
        <VueSvgGauge
            :start-angle="-110"
            :end-angle="110"
            :value="3"
            :separator-step="1"
            :min="0"
            :max="4"
            :gauge-color="[{ offset: 0, color: '#347AB0'}, { offset: 100, color: '#8CDFAD'}]"
            :scale-interval="0.1"
        />
    </div>
</template>

<script>
//import { VueSvgGauge } from 'vue-svg-gauge'

export default {
  name: 'gauge',
  components: {
    //VueSvgGauge,
    'VueSvgGauge': httpVueLoader('../uibuilder/vendor/uibuilder-vuejs-component-extras/gauge/gauge.vue'),
  }
}
</script>