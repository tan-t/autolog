const _ = require('lodash');

module.exports = function($app) {
    return CaptureService.initialize($app);
}

var CaptureService = {
    initialize($app) {
        this.$app_ = $app;
        this.bindEvents_();
        return this;
    },
    bindEvents_() {
        this.MessageListeners = {
            'shot' : this.shot.bind(this),
            'log' : this.log.bind(this)
        };
        chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
            if(!request.type in this.MessageListeners) {
                sendResponse({message:`undefined message type: ${request.type}`});
                return;
            }
            this.MessageListeners[request.type](request,sender,sendResponse);
        });
    },
    shot(request,sender,sendResponse) {
        var video = this.$app_.$el.querySelector('video');
        var canvas =  this.$app_.$el.querySelector('canvas');
        var ctx = canvas.getContext('2d');
        ctx.drawImage(video,0,0);
        var dataURL = canvas.toDataURL('image/webp');
        var item =  extendItem({src:dataURL},request.message);
        this.$app_.items.push(item);
        sendResponse({message:'shot'});
    },
    log(request,sender,sendResponse) {
        var item = extendItem({},request.message);
        this.$app_.items.push(item);
        sendResponse({message:'log'});
    }
}

const extendItem = function(baseObject,requestMessage) {
    return _.extend(baseObject,requestMessage,{useFlg:true});
}