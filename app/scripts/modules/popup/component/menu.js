import Vue  from 'vue';
import Vuetify  from 'vuetify';
Vue.use(Vuetify);

module.exports = function(Messenger) {
    var app = new Vue({
        el:'#popup-app',
        template: `
        <div>
            <v-card>
            <v-card-title> <h1>autolog</h1></v-card-title>
            <v-btn flat v-if="!recording" @click="onClickStart">Start Recording <v-icon>play_arrow</v-icon></v-btn>
            <v-btn flat v-if="recording" @click="onClickStop">Stop Recording<v-icon>pause</v-icon></v-btn>
            <v-container v-if="recording">
                <v-text-field
                label="Quick Memo"
                v-model="memo"
                autofocus
                @keyup.enter="onClickLog"
                ></v-text-field>
                <v-btn flat @click="onClickLog">Take a log</v-btn>
            </v-container>
            <v-btn flat @click="onClickConfig">Open Config</v-btn>
            </v-card>
        </div>
            `,
        data: {
            recording:false,memo:''
        },
        methods: {
            onClickStart() {
                Messenger.sendStartMessage().then(activated=>{
                    this.recording = activated;
                });
            },
            onClickStop() {
                Messenger.sendStopMessage().then(activated=>{
                    this.recording = activated;
                });
            },
            onClickLog() {
                Messenger.sendLogMessage(this.memo).then(activated=>{
                    this.recording = activated;
                });
            },
            onClickConfig() {
                chrome.runtime.openOptionsPage();
            }
        }
    });
    return app;
}