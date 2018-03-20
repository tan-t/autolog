const $ = require('./jquery-xpath');
const dao = require('../config').Dao;
const Messenger = require('./messenger');
const getDelegate = require('./delegate');
module.exports = function(){
    Messenger.sendPageMoveMessage();
    return ContentScriptService.init();
};

var ContentScriptService = {
    init() {
        return new Promise((resolve,reject)=>{
            dao.load().then(config=>{
            this.config_ = config;
            this.bindEvents_();
            resolve(this);
        });
    });
    },
    activate() {
        this.activated = true;
    },
    desactivate() {
        this.activated = false;
    },
    bindEvents_() {
        this.config_.listeners.forEach((listener)=>{
            $(document).on(listener.event,getDelegate(listener.selector,this.onEvent.bind(this,listener)));
        });
    },
    onEvent(listenerConfig,target) {
        if(!this.activated) {
            return;
        }

        if(!this.config_.noStyle) {
            $(target).addClass(uniqueClass);
        }

        Messenger.sendEventMessage(listenerConfig.event,this.getName(listenerConfig,target),listenerConfig.title);

        setTimeout(()=>{
                $(target).removeClass(uniqueClass);
        },3000);     

    },
    getName(listenerConfig,target) {
        if(listenerConfig.name && listenerConfig.name.length > 0) {
            return listenerConfig.name;
        }
        if(listenerConfig.nameSelector && listenerConfig.nameSelector.length > 0) {
            return $(target).xPath(listenerConfig.nameSelector).text();
        }
        
        // 空気読む
        if($(target).text().length > 0) {
            return $(target).text();
        }

        // 無理そうならid系
        if($(target).attr('id')){
            return $(target).attr('id');
        }

        if($(target).attr('name')){
            return $(target).attr('name');
        }

        // ここまで来てダメなら、逆に警告対象。
        return `【警告】セレクタ${listenerConfig.selector}に名称が指定されていません`;
    }
};

// ビルドプロセスに組み込む？
const uniqueClass = `auto-logger-1521295241186-outline`;