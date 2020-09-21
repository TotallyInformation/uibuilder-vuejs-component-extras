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

// eslint-disable-next-line no-unused-vars
var app1 = new Vue({
    el: '#app',

    components: {
        /** @see https://github.com/FranckFreiburger/http-vue-loader 
         * By adding a ref="myname" when using in your HTML, you can later reference
         * the component instance in your code: `this.$refs.myname` refs are not reactive though.
         */
        'gauge': httpVueLoader('../uibuilder/vendor/uibuilder-vuejs-component-extras/gauge/gauge.vue'),
    }, // --- End of components --- //

    data: {
        // Hold a copy of the value to use in index.html if you like
        gauge2Val: null,

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

        uibuilder.start()

        uibuilder.onChange('msg', function(msg){
            // Debug
            vueApp.msgRecvd = msg
            vueApp.msgsReceived = uibuilder.get('msgsReceived')

            /** If msg contains the _uib property ... */
            if ( msg._uib ) {
                /** Here we cheat to update the components props directly.
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
                            console.log(`new gauge value received: ${msg.payload}`)
                            //vueApp.gValue = msg.payload
                            vueApp.$refs[msg._uib.componentRef].$props['config']['value'] = msg.payload
                            
                            // We can still use the value in our index.html as well of course...
                            vueApp.gauge2Val = msg.payload
                        }
                    }
                }
            }
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

// EOF