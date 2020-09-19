/**
 * Master loader file for the `<lamp>` component
 */
/*
  Copyright (c) 2019 Julian Knight (Totally Information)

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
'use strict'

import lamp from './lamp.vue'

const Lamp = {
  install(Vue, options) {
    Vue.component('lamp', lamp)
  }
}

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null

if (typeof window !== 'undefined') {
	GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue
}

if (GlobalVue) {
	GlobalVue.use(Lamp)
}

// Allow the use as ES6 module
export { lamp as lamp }

// Allow the use as a pluggin
export default Lamp