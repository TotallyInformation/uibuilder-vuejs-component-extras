/* jshint browser: true, esversion: 5, asi: true */
/*globals Vue, uibuilder */
// @ts-nocheck
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

/** @see https://github.com/TotallyInformation/node-red-contrib-uibuilder/wiki/Front-End-Library---available-properties-and-methods */

import lamp from '../uibuilder/vendor/uibuilder-vuejs-component-extras/lamp/lamp-module.js'

// eslint-disable-next-line no-unused-vars
var app1 = new Vue({
    el: '#app',

    /** Load external component files
     *  Make sure there is no leading / in the name
     *  To load from the common folder use like: 'common/component-name.vue' */
    components: {
        lamp
    }, // --- End of components --- //

    data: {

        isonb: false,
        isona: false,
        isonc: false,
        isond: false,

        msgRecvd    : '[Nothing]',

    }, // --- End of data --- //

    computed: {

        hLastRcvd: function() {
            var msgRecvd = this.msgRecvd
            if (typeof msgRecvd === 'string') return 'Last Message Received = ' + msgRecvd
            else return 'Last Message Received = ' + this.syntaxHighlight(msgRecvd)
        },

    }, // --- End of computed --- //
    
    methods: {
    
        // Called if one of the bulb icons is clicked
        myClick: function(returnedData) {

            // returnedData.srcId contains the element id, returnedData.event contains the click event object
            console.log('Somebody clicked the ' + returnedData.srcId + ' icon!', returnedData)

            var out

            if ( returnedData.srcId === 'a' ) {
                out = this.isona = !this.isona
            }
            if ( returnedData.srcId === 'b' ) {
                out = this.isonb = !this.isonb
            }
            if ( returnedData.srcId === 'c' ) {
                out = this.isonc = !this.isonc
            }
            if ( returnedData.srcId === 'd' ) {
                out = this.isond = !this.isond
            }

            // Lets tell Node-RED
            uibuilder.send({
                'topic': returnedData.srcId.toUpperCase(),
                'payload': out,
            })

        }, // -- End of myClick -- //

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

        //console.debug('[indexjs:Vue.mounted] app mounted - setting up uibuilder watchers')

        /** **REQUIRED** Start uibuilder comms with Node-RED @since v2.0.0-dev3
         * Pass the namespace and ioPath variables if hosting page is not in the instance root folder
         * e.g. If you get continual `uibuilderfe:ioSetup: SOCKET CONNECT ERROR` error messages.
         * e.g. uibuilder.start('/nr/uib', '/nr/uibuilder/vendor/socket.io') // change to use your paths/names
         */
        uibuilder.start()

        // If msg changes - msg is updated when a standard msg is received from Node-RED over Socket.IO
        uibuilder.onChange('msg', function(msg){

            //console.info('[indexjs:uibuilder.onChange] msg received from Node-RED server:', msg)
            app1.msgRecvd = msg

            if ( msg.payload.hasOwnProperty('A') ) {
                app1.isona = msg.payload.A
            }
            if ( msg.payload.hasOwnProperty('B') ) {
                app1.isonb = msg.payload.B
            }
            if ( msg.payload.hasOwnProperty('C') ) {
                app1.isonc = msg.payload.C
            }
            if ( msg.payload.hasOwnProperty('D') ) {
                app1.isond = msg.payload.D
            }

        }) // -- End of msg received -- //

    } // --- End of mounted hook --- //

}) // --- End of app1 --- //

// EOF