var component = {
    name:'timeline',
    template:`

    <div>
    <v-app id="inspire">      
      <v-toolbar
        color="blue darken-3"
        dark
        app
        :clipped-left="$vuetify.breakpoint.mdAndUp"
        fixed
      >
        <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
          <span class="hidden-sm-and-down">Report</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu attach="#activator_" light offset-x left min-width="240px">
        <v-btn icon slot="activator" id="activator_">
            <v-icon>menu</v-icon>
        </v-btn>
        <v-list>
            <v-list-tile v-if="!hideMode" @click="onClickHideAllDeleted">
                    <v-list-tile-title>HIDE ALL DELETED<v-icon>visibility_off</v-icon></v-list-tile-title>
            </v-list-tile>
            <v-list-tile v-if="hideMode" @click="onClickEndHideMode">
                    <v-list-tile-title>SHOW ALL ITEMS<v-icon>visibility</v-icon></v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="onClickRestoreAll">
            <v-list-tile-title>RESTORE ALL <v-icon>restore_page</v-icon></v-list-tile-title>
    </v-list-tile>
        </v-list>
    </v-menu>
      </v-toolbar>
      <v-content>            
    <v-card>
    <v-card-title>
      <h1>Report Timeline</h1>
      <v-spacer></v-spacer>
      <v-text-field
        append-icon="search"
        label="Search"
        single-line
        hide-details
        v-model="search"
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      :rows-per-page-items="[30,{text:'All',value:-1}]"
    >
      <template slot="items" slot-scope="props">
        <td v-show="props.item.useFlg || !hideMode">
        <div style="width:800px;" :class="{ 'item-hidden' : !props.item.useFlg }">
          <div class="item-hidden-text">image currently hidden</div>
          <img style="width:800px;" :src="props.item.src"></img>
        </div>
        </td>
        <td class="text-xs-left" v-show="props.item.useFlg || !hideMode">{{ props.item.title }}</td>
        <td class="text-xs-left" v-show="props.item.useFlg || !hideMode">
        <v-edit-dialog
        :return-value.sync="props.item.log"
        lazy
      > {{ props.item.log }}
        <v-text-field
          slot="input"
          label="Edit"
          v-model="props.item.log"
          single-line
        ></v-text-field>
      </v-edit-dialog>
        </td>
        <td class="text-xs-left" v-show="props.item.useFlg || !hideMode">{{ props.item.time }}</td>
        <td class="text-xs-left" v-show="props.item.useFlg || !hideMode">{{ props.item.url }}</td>
        <td class="text-xs-left" v-show="props.item.useFlg || !hideMode">
        <v-btn v-if="props.item.useFlg" @click="onClickDelete(props.item)"><v-icon>delete</v-icon></v-btn>
        <v-btn v-if="!props.item.useFlg" @click="onClickRestore(props.item)"><v-icon>restore</v-icon></v-btn>
        </td>
      </template>
        Your search for "{{ search }}" found no results.
      </v-alert>
    </v-data-table>
  </v-card>
      </v-content>
    </v-app>
  </div>


    `,
    data () {
        return {
          headers: [
            {
              text: 'Captured Image',
              sortable: false,
              value: 'src'
            },
            { text: 'Title', value: 'title' },
            { text: 'Log', value: 'log' },
            { text: 'Taken Timestamp', value: 'time' },
            { text: 'URL', value: 'url' },
            { 
              text: 'Edit',
             value: 'edit' ,
             sortable:false
            },
          ],
          search:null,
          hideMode:false
        }
      },
    props : ['items'],
    methods: {
      onClickDelete(item) {
        item.useFlg = false;
      },
      onClickRestore(item) {
        item.useFlg = true;
      },
      onClickRestoreAll() {
        this.items.forEach(item=>{
          this.onClickRestore(item);
        });
      },
      onClickHideAllDeleted() {
        this.hideMode = true;
      },
      onClickEndHideMode() {
        this.hideMode = false;
      },
    }
};

module.exports = component;

