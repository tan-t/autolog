var component = {
    name:'timeline',
    template:`
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
        <td>
        <div style="width:800px;"><img style="width:800px;" :src="props.item.src"></img></div>
        </td>
        <td class="text-xs-left">{{ props.item.title }}</td>
        <td class="text-xs-left">{{ props.item.log }}</td>
        <td class="text-xs-left">{{ props.item.time }}</td>
        <td class="text-xs-left">{{ props.item.url }}</td>
      </template>
        Your search for "{{ search }}" found no results.
      </v-alert>
    </v-data-table>
  </v-card>
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
          ],
          search:null
        }
      },
    props : ['items']
};

module.exports = component;

