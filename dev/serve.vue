<script>
import Vue from 'vue';
import { UibuilderVuejsComponentExtrasSample } from '@/entry';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    UibuilderVuejsComponentExtrasSample,
  }
});
</script>

<template>
  <div id="app">
    <uibuilder-vuejs-component-extras-sample />
  </div>
</template>
