const _ = require('lodash');
module.exports = {

    /**
     * 
     * @param {string} event 
     * @param {string} name 
     * @param {string} title 
     */
    sendEventMessage(event,name,title) {
        var item = new Item(event,name,title);
        return new Promise((resolve,reject)=>{
                chrome.runtime.sendMessage({type:'shot-request',message:item.toMessageObject()},(res)=>{
                // nothing to do
            });
        });
    },
    /**
     * ページ遷移したことを通知する
     */
    sendPageMoveMessage() {
        var item = Item.pageMove();
        return new Promise((resolve,reject)=>{
                chrome.runtime.sendMessage({type:'shot-request',message:item.toMessageObject()},(res)=>{
                // nothing to do
            });
        });
    }
}

class Item {
    /**
     * 
     * @param {string} event 
     * @param {string} name 
     * @param {string} title 
     */
    constructor(event,name,title) {
        this.event = event;
        this.name = name;
        this.title = title;
        this.time = new Date(Date.now()).toLocaleString();
        this.url = location.href;
    }
    toMessageObject() {
        var base = {time:this.time,url:this.url};
        if(!this.event) {
            return _.extend({log:`ページが読み込まれました。`,title:'ページの読み込み'},base);
        }
        return _.extend({log:`${this.name}に対して${this.event}が発火されました。`,title:this.title},base);
    }

    static pageMove() {
        return new Item();
    }
}