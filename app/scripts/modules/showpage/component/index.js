import Vue  from 'vue';
import Vuetify  from 'vuetify';
Vue.use(Vuetify);

const Timeline = require('./timeline.js');
const VideoCanvas = require('./video.js');

module.exports = function() {
    var app = new Vue({
        el:'#app',
        template: `
        <div>
        <timeline :items="items"/>
        <video-canvas :blobUrl="blobUrl"/>
        </div>
        `,
        components: { Timeline,VideoCanvas },
        data: {
            items:[],
            blobUrl:''
        }
    });
    return app;
}