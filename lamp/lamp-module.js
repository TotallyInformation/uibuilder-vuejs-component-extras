export default {

    template: `
            <svg @click="doClick" :style="ciconstyle" :height="height" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="shadow">
                    <feDropShadow dx="1" dy="1" stdDeviation="5" flood-opacity="50%" />
                </filter>
                <filter id="glow" filterUnits="userSpaceOnUse"
                        x="-50%" y="-50%" width="200%" height="200%">
                    <!-- blur the text at different levels-->
                    <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur5"/>
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur10"/>
                    <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur20"/>
                    <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur30"/>
                    <feGaussianBlur in="SourceGraphic" stdDeviation="50" result="blur50"/>
                    <!-- merge all the blurs except for the first one -->
                    <feMerge result="blur-merged">
                        <feMergeNode in="blur10"/>
                        <feMergeNode in="blur20"/>
                        <feMergeNode in="blur30"/>
                        <feMergeNode in="blur50"/>
                    </feMerge>
                    <!-- recolour the merged blurs red-->
                    <feColorMatrix result="red-blur" in="blur-merged" type="matrix"
                                    values="1 0 0 0 0
                                            0 0.06 0 0 0
                                            0 0 0.44 0 0
                                            0 0 0 1 0" />
                    <feMerge>
                        <!--<feMergeNode in="red-blur"/>        largest blurs coloured red -->
                        <feMergeNode in="blur-merged"/>
                        <feMergeNode in="blur5"/>          <!-- smallest blur left white -->
                        <feMergeNode in="SourceGraphic"/>  <!-- original -->
                    </feMerge>
                </filter>
                <slot name="filter"></slot>
            </defs>
            <title>{{title}}</title>
            <slot name="icon"><path :fill="cfillcolor" d="M511.549861 803.293331H408.419043a73.232959 73.232959 0 0 1-67.1862-41.991375 59.795719 59.795719 0 0 1-6.71862-30.569722 207.60536 207.60536 0 0 0-33.593101-113.88061 196.519637 196.519637 0 0 0-27.882273-33.5931A463.248853 463.248853 0 0 1 217.274302 504.314738a399.086031 399.086031 0 0 1-36.95241-75.248544 242.542184 242.542184 0 0 1-15.116895-77.264131 349.032312 349.032312 0 0 1 8.062344-84.990544 314.76735 314.76735 0 0 1 51.733375-114.888403A367.172586 367.172586 0 0 1 361.724634 34.011334 327.532728 327.532728 0 0 1 433.949799 8.144647 369.524103 369.524103 0 0 1 528.682342 0.418234a333.579486 333.579486 0 0 1 126.310057 29.225997 326.860866 326.860866 0 0 1 70.881442 44.678824A382.625412 382.625412 0 0 1 808.848799 168.383736a314.095488 314.095488 0 0 1 41.991375 105.146403 312.751764 312.751764 0 0 1 6.382689 92.045095 275.799353 275.799353 0 0 1-20.15586 76.256338 449.139751 449.139751 0 0 1-61.139443 107.16199 497.513815 497.513815 0 0 1-33.5931 39.639858 160.575019 160.575019 0 0 0-31.241583 48.038134 215.331773 215.331773 0 0 0-18.812136 55.428615c-1.679655 11.757585 0 23.179239-2.687448 33.5931a171.660742 171.660742 0 0 1-3.695241 25.194826 69.873649 69.873649 0 0 1-33.593101 40.647651 74.576683 74.576683 0 0 1-39.639858 10.07793zM490.050277 88.768088c-11.085723 0-22.171446 2.351517-33.5931 4.031172a210.96467 210.96467 0 0 0-74.240752 26.538549 244.221839 244.221839 0 0 0-55.428616 44.342893 222.386324 222.386324 0 0 0-43.335099 63.82689 230.784599 230.784599 0 0 0-19.483998 94.732543 28.218204 28.218204 0 0 0 33.5931 28.890066 28.890066 28.890066 0 0 0 22.171446-26.202618v-13.773171a167.965501 167.965501 0 0 1 9.406068-49.045927 184.762052 184.762052 0 0 1 64.834684-83.98275 167.965501 167.965501 0 0 1 93.72475-33.593101 142.770676 142.770676 0 0 0 18.140274 0 23.851101 23.851101 0 0 0 19.148067-15.452826 33.5931 33.5931 0 0 0 0-19.483998 23.51517 23.51517 0 0 0-20.491791-18.140274 122.950747 122.950747 0 0 0-15.116895 0zM647.601917 943.040628a15.788757 15.788757 0 0 1-13.773171 15.116895H400.356699a17.468412 17.468412 0 0 1-16.460619-8.734206 18.812136 18.812136 0 0 1 0-20.15586 16.124688 16.124688 0 0 1 16.460619-4.703034h227.089358a19.148067 19.148067 0 0 1 19.148067 20.827722zM405.731595 899.369598a18.140274 18.140274 0 0 1-16.460619-12.765378 17.804343 17.804343 0 0 1 15.452826-23.851101H635.508401a18.812136 18.812136 0 0 1 17.804343 13.773171 19.819929 19.819929 0 0 1-10.749792 21.499584 24.187032 24.187032 0 0 1-8.734206 0H423.535938zM437.64504 1022.992207a17.132481 17.132481 0 0 1-15.452826-9.406068 18.140274 18.140274 0 0 1 15.116895-26.202618h139.411367a19.819929 19.819929 0 0 1 19.483998 17.804343 16.124688 16.124688 0 0 1-8.734206 15.788757 19.148067 19.148067 0 0 1-9.741999 3.023379H442.348074z" /></slot>
            <slot name="default"></slot>
        </svg>
    `,

    // NB: prop defined as 'home-data' because it is used as an HTML attribute. BUT use as variable 'homeData'
    props: {
        //b1color: '#F5BC1A',
        color: {
            type: String,
            required: false,
            default: 'grey',
        },
        height: {
            type: String,
            required: false,
            default: '32',
        },
        x: {
            type: String,
            required: false,
            default: '0',
        },
        y: {
            type: String,
            required: false,
            default: '0',
        },
        title: {
            type: String,
            required: false,
            default: '',
        },
        clickable: {
            type: Boolean,
            required: false,
            default: false,
        },
        glow: {
            type: Boolean,
            required: false,
            default: false,
        },
        ison: {
            type: Boolean,
            required: false,
            default: false,
        },
        filter: {
            type: String,
            required: false,
            default: '',
        },
    }, // -- End of props -- //

    data: function() { return {
    }}, // -- End of data -- //

    computed: {

        /** Compute the current fill colour */
        cfillcolor: function() {
            return this.ison ? '#d4af37' : this.color
        }, // - End of cfillcolor - //

        /** Compute the current style */
        ciconstyle: function() {
            var cssfilter = 'shadow'

            if (this.filter.length > 0) {
                cssfilter = this.filter
            } else if (this.glow || this.ison) {
                cssfilter = 'glow'
            }

            return {
                //'color': this.cfillcolor, //this.ison ? '#d4af37' : this.color,
                'top': this.y,
                'left': this.x,
                'cursor': this.clickable ? 'pointer' : 'default',
                'position': 'absolute',
                'filter': 'url(#' + cssfilter + ')',
                //'transition': 'filter 2s ease-in-out', //'filter 10s',
            }
        }, // - End of ciconstyle - //

    }, // -- End of methods -- //

    methods: {

        /** When the icon is clicked, emit an event
         *  and optionally return some data to the parent
         * In the parent: <bulb @bulbclicked="myClick"></bulb>
         * and define method `myclick: function(event, returnData){}`
         */
        doClick: function(event) {
            if ( !this.clickable ) return
            
            var returnData = { 
                'srcId': '',
                'event': event,
            }

            // Try to find which icon was clicked (have to have an id attrib on the <bulb> tag)
            var whichIcon = this.findWithAttr(event.path,'tagName','svg')

            if ( whichIcon !== -1 ) {
                // Report back the src tag id
                returnData.srcId = event.path[whichIcon].id
            }

            this.$emit('lampclicked', returnData)

            //console.log('Icon clicked! (COMPONENT)', event)
        }, // - End of doClick() - //

        /** Find array element by object attribute or return -1
         * @param {Array} array The array to search
         * @param {string} prop The property used for searching
         * @returns {number} Array offset or -1
         */
        findWithAttr: function(array, prop, value) {
            for(var i = 0; i < array.length; i += 1) {
                if(array[i][prop] === value) {
                    return i;
                }
            }
            return -1;
        }, // - End of findWithAttr() - //

    }, // -- End of methods -- //

}