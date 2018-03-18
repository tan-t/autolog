var component = {
    name:'single-form',
    template:`
    <v-form>
    <v-text-field
    label="Title"
    v-model="value.title"
    @input="onInput"
    ></v-text-field>
    
    <div id="eventSelect">&nbsp;</div>

    <v-select
    :items="events"
    v-model="value.event"
    label="Event"
    autocomplete
    attach="#eventSelect"
    light
    ></v-select>
    <v-text-field
      label="Name(optional,fixed value)"
      v-model="value.name"
    ></v-text-field>
    <v-text-field
    label="Selector"
    v-model="value.selector"
    @input="onInput"
    hint="CSS selector or XPath"
    ></v-text-field>
    <v-text-field
    label="NameSelector(optional,in xpath)"
    v-model="value.nameSelector"
    hint="relative XPath from selected element (like '..')"
    @input="onInput"
    ></v-text-field>
    <h3 class="text-xs-left"> name selector => {{absoluteNameSelector}} </h3>
    </v-form>
    `,
    props : ['value'],
    data: ()=>({
        events : [
            {text:'クリック (click)',value:'click'},
            {text:'フォーカスアウト (focusout)',value:'focusout'},
            {text:'チェンジ (change)',value:'change'},
            {text:'キーダウン (keydown)',value:'keydown'},
            {text:'キーアップ (keyup)',value:'keyup'},
        ]
    }),
    computed: {
        absoluteNameSelector() {
            return this.value.selector + '/' + this.value.nameSelector;
        },
    },
    methods : {
        onInput() {
            this.$emit('input',this.value);
        }
    }

};

module.exports = component;

