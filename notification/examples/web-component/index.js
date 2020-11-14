/* jshint browser: true, esversion: 5, asi: true */
/*globals Vue, uibuilder, httpVueLoader */
// @ts-nocheck
/*
  Copyright (c) 2020 Julian Knight (Totally Information)

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

/** @see https://github.com/TotallyInformation/node-red-contrib-uibuilder/wiki/Front-End-Library---available-properties-and-methods */

import gauge from '../uibuilder/vendor/uibuilder-vuejs-component-extras/gauge/gauge-module.js'
// We can't import svg gauge here as it doesn't provide an `export default`, it uses the old-style `module.exports` - load in html instead

// eslint-disable-next-line no-unused-vars
var app1 = new Vue({
    el: '#app',

    components: {
        gauge
    }, // --- End of components --- //

    data: {
        // Hold a copy of the value to use in index.html if you like
        gauge2Val: 0,

        //#region debug
        startMsg    : 'Vue has started, waiting for messages',
        feVersion   : '',
        socketConnectedState : false,
        serverTimeOffset     : '[unknown]',
        imgProps             : { width: 75, height: 75 },

        msgRecvd    : '[Nothing]',
        msgsReceived: 0,
        msgCtrl     : '[Nothing]',
        msgsControl : 0,

        msgSent     : '[Nothing]',
        msgsSent    : 0,
        msgCtrlSent : '[Nothing]',
        msgsCtrlSent: 0,
        //#endregion

    }, // --- End of data --- //
    computed: {
        hLastRcvd: function() {
            var msgRecvd = this.msgRecvd
            if (typeof msgRecvd === 'string') return 'Last Message Received = ' + msgRecvd
            else return 'Last Message Received = ' + this.syntaxHighlight(msgRecvd)
        },
        hLastSent: function() {
            var msgSent = this.msgSent
            if (typeof msgSent === 'string') return 'Last Message Sent = ' + msgSent
            else return 'Last Message Sent = ' + this.syntaxHighlight(msgSent)
        },
        hLastCtrlRcvd: function() {
            var msgCtrl = this.msgCtrl
            if (typeof msgCtrl === 'string') return 'Last Control Message Received = ' + msgCtrl
            else return 'Last Control Message Received = ' + this.syntaxHighlight(msgCtrl)
        },
        hLastCtrlSent: function() {
            var msgCtrlSent = this.msgCtrlSent
            if (typeof msgCtrlSent === 'string') return 'Last Control Message Sent = ' + msgCtrlSent
            //else return 'Last Message Sent = ' + this.callMethod('syntaxHighlight', [msgCtrlSent])
            else return 'Last Control Message Sent = ' + this.syntaxHighlight(msgCtrlSent)
        },
    }, // --- End of computed --- //
    methods: {
        // return formatted HTML version of JSON object
        syntaxHighlight: function(json) {
            json = JSON.stringify(json, undefined, 4)
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                var cls = 'number'
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key'
                    } else {
                        cls = 'string'
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean'
                } else if (/null/.test(match)) {
                    cls = 'null'
                }
                return '<span class="' + cls + '">' + match + '</span>'
            })
            return json
        }, // --- End of syntaxHighlight --- //
    }, // --- End of methods --- //

    // Available hooks: init,mounted,updated,destroyed
    mounted: function(){
        var vueApp = this
        vueApp.feVersion = uibuilder.get('version')

        if (vueApp.feVersion < '3.0.0-dev.5') {
            console.error('\n\nuibuilderfe MUST be at version 3.0.0-dev.5 or above\n  if not, change the start parameter (remove the vueApp reference) \n  and use the local processUibMsg function.\n\n\n')
        }

        /** ⭐❗ You MUST pass a Vue app reference to uibuilder so that it can update the components directly ❗⭐ */
        /** Startup socket.io comms - must be done manually to allow for changes to namespace/path e.g. if this file is not in the root folder.
         * @param {Object=|string=} namespace Optional. Object containing ref to vueApp, Object containing settings, or IO Namespace override. changes self.ioNamespace from the default.
         * @param {string=} ioPath Optional. changes self.ioPath from the default
         * @param {Object=} vueApp Optional. reference to the VueJS instance
         */
        //uibuilder.start(vueApp)
        uibuilder.start()

        /** -- TEST uibuilder startup parameter options -- 
         * uibuilder.start(vueApp)
         * uibuilder.start(null, null, vueApp)
         * uibuilder.start('fred', 'jim', vueApp)
         * uibuilder.start('fred', 'jim', 'dora')
         * uibuilder.start({'namespace':'fred'}, null, vueApp)
         * uibuilder.start({'namespace':'fred', 'vueApp': vueApp}, null, 'dora')
         */

        uibuilder.onChange('msg', function(msg){
            // Debug
            vueApp.msgRecvd = msg
            vueApp.msgsReceived = uibuilder.get('msgsReceived')

            // We can still use the value in our index.html as well of course...
            vueApp.gauge2Val = msg.payload

            // but now, uibuilderfe takes care of updating the gauges
            // no code is required!

            // If it isn't working, try this instead (you may have the wrong version of uibuilder deployed)
            processUibMsg(msg, vueApp)


        })

        //#region
        uibuilder.onChange('ctrlMsg', function(msg){
            //console.info('[indexjs:uibuilder.onChange:ctrlMsg] CONTROL msg received from Node-RED server:', msg)
            vueApp.msgCtrl = msg
            vueApp.msgsControl = uibuilder.get('msgsCtrl')
        })
        uibuilder.onChange('sentMsg', function(msg){
            //console.info('[indexjs:uibuilder.onChange:sentMsg] msg sent to Node-RED server:', msg)
            vueApp.msgSent = msg
            vueApp.msgsSent = uibuilder.get('msgsSent')
        })
        uibuilder.onChange('sentCtrlMsg', function(msg){
            //console.info('[indexjs:uibuilder.onChange:sentCtrlMsg] Control message sent to Node-RED server:', msg)
            vueApp.msgCtrlSent = msg
            vueApp.msgsCtrlSent = uibuilder.get('msgsSentCtrl')
        })
        uibuilder.onChange('ioConnected', function(connected){
            //console.info('[indexjs:uibuilder.onChange:ioConnected] Socket.IO Connection Status Changed to:', connected)
            vueApp.socketConnectedState = connected
        })
        uibuilder.onChange('serverTimeOffset', function(serverTimeOffset){
            //console.info('[indexjs:uibuilder.onChange:serverTimeOffset] Offset of time between the browser and the server has changed to:', serverTimeOffset)
            vueApp.serverTimeOffset = serverTimeOffset
        })

        //#endregion ---- End of Trace Sent Messages ---- //

    }, // --- End of mounted hook --- //

}) // --- End of app1 --- //

/** Feed data and config direct to a component instance
 * This function will be moved into uibuilderfe eventually. 
 * window.Vue must exist.
 * @param {Object} msg A message object from Node-RED uibuilder node. If msg._uib doesn't exist, no action taken.
 * @param {Object} vueApp Reference to the master VueJS app instance
 */
function processUibMsg(msg, vueApp) {
    // If Vue object not present or the msg._uib object not available, don't do anything
    if ( !Vue || !msg._uib ) return

    // if ( ! Vue ) console.log('❌ VueJS not available!')
    // else console.log('✅ VueJS IS available!')
    //console.log('processUibMsg', Object.keys(window), Object.keys(Vue)) //VueSvgGauge

    /** Here we "cheat" to update the components props directly.
     *  This saves users from having to define props and data.
     * 
     *  This code will be moved into uibuilderfe to make it completely hidden.
     *  All you will need is to know the format of data to send.
     */
    if (msg._uib.componentRef) { // Does the _uib object have a component reference?
        if ( msg._uib.componentRef in vueApp.$refs ) { // Does the ref exist?
            /** Copy each prop direct into the component (updates the DOM if needed) */
            Object.keys(msg._uib.options).forEach( key => {
                //vueApp.gaugeConfig[key] = msg._uib.options[key]
                vueApp.$refs[msg._uib.componentRef].$props['config'][key] = msg._uib.options[key]
            })
            /** Also check if the payload is a number. If it is update the gauges value with it */
            if ( typeof msg.payload === 'number' ) {
                console.log(`🔢📈 new gauge value received: ${msg.payload}`)
                //vueApp.gValue = msg.payload
                vueApp.$refs[msg._uib.componentRef].$props['config']['value'] = msg.payload
                
            }
        }
    }

} // --- End of processUibMsg() --- //

// EOF