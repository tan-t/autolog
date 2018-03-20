import Vue  from 'vue';
import Vuetify  from 'vuetify';
Vue.use(Vuetify);

const SingleForm = require('./single-form');
const saveAs = require('file-saver').saveAs;

module.exports = function(dao) {
    var app = new Vue({
        el:'#option-app',
        components:{SingleForm},
        template: `
        <v-container grid-list-xl text-xs-center>
            <v-card>
            <v-card-title class="blue white--text">
                <span class="headline">Config</span>
                <v-spacer></v-spacer>
                <v-menu attach="#activator_" offset-x left min-width="160px">
                    <v-btn icon slot="activator" light id="activator_">
                        <v-icon>more_vert</v-icon>
                    </v-btn>
                    <v-list>
                        <v-list-tile>
                            <v-list-tile-title>
                                    <label for="upload">
                                        <input type="file" id="upload" name="upload" style="display:none" @change="onImport"/>JSON IMPORT <v-icon>file_upload</v-icon>
                                    </label>
                            </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="onClickExport">
                                <v-list-tile-title>JSON EXPORT <v-icon>file_download</v-icon></v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-card-title>
                
                <v-layout row wrap>
                    <v-flex xs10 offset-xs1>
                    <v-subheader>Overall</v-subheader>
                    <v-checkbox :label="noStyleLabel" v-model="config.noStyle"></v-checkbox>
                    <v-subheader>Listeners</v-subheader>
                    <v-expansion-panel expand>
                    <v-expansion-panel-content v-for="item in config.listeners" :key="item.id">
                      <div slot="header">{{item.title}} <v-spacer></v-spacer> {{ item.unlisten ? "unlistening" : "listening" }}</div>
                      <v-card class="elevation-1" >
                          <v-card-text>
                              <single-form :value="item" @input="value => {item = value}"></single-form>
                          </v-card-text>
                          <v-card-actions>
                              <v-btn flat color="orange" @click="onClickDelete(item.id)">Delete</v-btn>
                          </v-card-actions>
                      </v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                        <v-btn flat color="primary" @click="onClickAdd()">Add Listener</v-btn>
                        <v-btn flat color="primary" @click="onClickSave()">Save</v-btn>
                    </v-flex>
                </v-layout>
                
            </v-card>

            <v-snackbar
            :timeout="3000"
            :top="true"
            v-model="snackbar"
            >
            {{snackbarMessage}}
            <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
          </v-snackbar>

          <v-snackbar
          :timeout="3000"
          :top="true"
          v-model="hasError"
          color="danger"
          >
          {{errorInfo}}
          <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
        </v-snackbar>
        </v-container>
        `,
        computed : {
            noStyleLabel() {
                return `Suppress outline styling is now ${this.config.noStyle ? "enabled." : "disabled."}`;
            }
        },
        data: {
            config : {
                listeners:[]
            },snackbar:false,snackbarMessage:'',hasError:false,errorInfo:''            
        },
        methods: {
            onClickAdd() {
                var id = new Date().getTime();
                this.config.listeners.push({id,title:'無題のイベント',event:'',name:'',selector:'',nameSelector:''});
            },
            onClickDelete(id) {
                this.config.listeners.splice(this.config.listeners.findIndex(item=>item.id===id),1);
            },
            onClickSave() {
                dao.update(this.createModel()).then(()=>{
                    this.snackbar = true;
                    this.snackbarMessage = 'saved.';
                });
            },
            createModel() {
                return this.config;
            },
            onClickExport() {
                var blob = new Blob([JSON.stringify(this.createModel())], {type: "text/plain;charset=utf-8"});
                saveAs(blob, "config.json");
            },
            onImport(e) {
                // 必ず1件だけ取得する。
                var file = e.target.files[0];
                console.log(file.name);
                if(!json.test(file.name)) {
                    this.hasError = true;
                    this.errorInfo = 'not json format';
                    return;
                 }

                var reader = new FileReader();
                // エラー処理
                reader.onerror = (errorEvent) =>{
                    console.error(errorEvent.target.error.code);
                    
                }

                // 読み込み後の処理
                reader.onload = (loadedEvent) => {
                    var jsonString = loadedEvent.target.result;
                    try {
                        this.config = JSON.parse(jsonString);
                        this.snackbar = true;
                        this.snackbarMessage = 'imported.';
                    } catch (exception) {
                        console.error(exception,jsonString);
                        this.hasError = true;
                        this.errorInfo = 'JSON parse error.';
                    }
                };

                reader.readAsText(file);
            }
        }
    });
    return app;
}

const json = /\.json$/;