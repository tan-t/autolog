const _ = require('lodash');
module.exports = function() {
    return BackGroundService.initialize();
}

var BackGroundService = {
    initialize() {
        this.streamMap = {};
        this.managedTabMap = {};
        this.blobUrlMap = {};
        this.bindEvents_();
        console.log('initialized background service.');
        return this;
    },
    bindEvents_() {
    this.MessageListeners = {
            'greet' : this.onGreet.bind(this),
            'shot-request' : this.onShotRequest.bind(this),
            'shot-request-popup' : this.onShotRequestPopup.bind(this),
            'log-request' : this.onLogRequest.bind(this),
            'check-activated' : this.onCheckActivated.bind(this),
            'check-activated-popup' : this.onCheckActivatedFromPopup.bind(this),
            'toggle-tab-capture' : this.onToggleTabCaptureMessage.bind(this),
    },
    this.CommandListeners = {
            'toggle-tab-capture' : this.onToggleTabCapture.bind(this),
            'shot' : this.onShotCommand.bind(this),
    },
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            if(this.MessageListeners[request.type]) {
                return this.MessageListeners[request.type](request,sender,sendResponse);
            }
            log.error(`undefined request type : ${request.type}`);
            return;
    }.bind(this));
    chrome.commands.onCommand.addListener(function(command) {
            if(this.CommandListeners[command]) {
                return this.CommandListeners[command](command);
            }
            log.error(`undefined command : ${command}`);
            return;
    }.bind(this));

    chrome.tabs.onRemoved.addListener((tabId, info)=>{
        var fromTabId = Object.keys(this.managedTabMap).find(key=>{
            return this.managedTabMap[key] == tabId;
        });
        if(!fromTabId) {
            return;
        }
        this.streamMap[fromTabId].getTracks().forEach(t=>t.stop());
        delete this.streamMap[fromTabId];
        delete this.managedTabMap[fromTabId];
        
        chrome.tabs.sendMessage(fromTabId,{type:'desactivate'},(res)=>{
            console.log('tab is successfully desactivated.',tab);
        });
    });
    },
    // スクリーンショットを管理する裏ページに対して、videoのbrobUrlを渡す。
    onGreet(request,sender,sendResponse) {
        var fromTabId = sender.tab.id;
        var blobUrl = this.blobUrlMap[fromTabId];
        sendResponse({ message: "ok" ,blobUrl});
    },
    // contentStriptからスクリーンショットの撮影依頼を受け取り、
    // スクリーンショット管理ページに渡す。
    onShotRequest(request,sender,sendResponse) {
        var fromTabId = sender.tab.id;
        this.onShotRequestCommon(request.message,fromTabId,sendResponse);
    },
    onShotRequestCommon(message,fromTabId,sendResponse) {
        if(!this.managedTabMap[fromTabId]){
            sendResponse({activated:false});
            return;
          }

          chrome.tabs.sendMessage(this.managedTabMap[fromTabId],{type:'shot',message},(res)=>{
            sendResponse({activated:true});
          });
    },
    onShotRequestPopup(request,sender,sendResponse) {
        this.getCurrentTab().then(tab=>{
            var fromTabId = tab.id;
            var message = _.extend({time:new Date(Date.now()).toLocaleString(),url:tab.url},request.message)
            this.onShotRequestCommon(message,fromTabId,sendResponse);
        });
        return true;
    },
    onLogRequest(request,sender,sendResponse) {
        var fromTabId = sender.tab.id;
        if(!this.managedTabMap[fromTabId]){
            sendResponse();
            return;
        }
        chrome.tabs.sendMessage(this.managedTabMap[fromTabId],{type:'log',message:request.message},(res)=>{
          sendResponse({message:'logged'});
        });
    },
    // スクリーンショットのショートカットキーを受け取り、
    // スクリーンショット管理ページに渡す。
    onShotCommand(command) {
    this.getCurrentTab().then(tab=>{
            var tabId = tab.id;
            if(!this.managedTabMap[tabId]){
              return;
            }
            chrome.tabs.sendMessage(this.managedTabMap[tabId],{type:'shot',message:{time:new Date(Date.now()).toLocaleString(),url:tab.url,log:'ショートカットキーからのキャプチャです。'}},(res)=>{
              console.log(res);
        });
    });
    },
    // スクリーンショットの撮影開始を受け取る。
    onToggleTabCapture(command) {
            return this.getCurrentTab().then(tab=>{
            var tabId = tab.id;
              if(this.streamMap[tabId]){
                this.streamMap[tabId].getTracks().forEach(t=>t.stop());
                delete this.streamMap[tabId];
                chrome.tabs.sendMessage(tabId,{type:'desactivate'},(res)=>{
                    console.log('tab is successfully desactivated.',tab);
                });
                return {activated:false};
            }
            return new Promise(function(resolve, reject) {
                chrome.tabCapture.capture({audio:false,video:true},stream=>resolve(stream));
            }).then(stream=>{
                this.streamMap[tabId] = stream;
                var blobUrl = window.URL.createObjectURL(stream);
                return this.createOrReactivateManagedTab(tabId,blobUrl);
            }).then(set=>{
                this.managedTabMap[tabId] = set.openTabId;
                this.blobUrlMap[set.openTabId] = set.blobUrl;
                return {activated:true};
            });

            chrome.tabs.sendMessage(tabId,{type:'activate'},(res)=>{
                console.log('tab is successfully activated.',tab);
            })
        });
    },

    onToggleTabCaptureMessage(request,sender,sendResponse) {
        this.onToggleTabCapture().then(activatedObj=>{
            console.log(activatedObj);
            sendResponse(activatedObj);
        });
        return true;
    },
    createOrReactivateManagedTab(fromTabId,blobUrl) {
        return new Promise((resolve, reject)=>{
            if(this.managedTabMap[fromTabId]){
                var managedTabMapId = this.managedTabMap[fromTabId];
                chrome.tabs.sendMessage(managedTabMapId,{type:'reactivate',message:{blobUrl}},(res)=>{
                    console.log('managed tab is successfully reactivated.');
                })
                resolve({openTabId:managedTabMapId,blobUrl});
                return;
            }
            chrome.tabs.create({url: '../../../pages/showpage/showpage.html',active:false},openTab=>{
                resolve({openTabId:openTab.id,blobUrl});
            });
        });
    },
    checkActivated(fromTabId) {
        if(!this.streamMap[fromTabId]){
            return {activated:false};
        }
        return {activated:true};
    },
    onCheckActivated(request,sender,sendResponse){
        var fromTabId = sender.tab.id;
        sendResponse(this.checkActivated(fromTabId));
    },
    onCheckActivatedFromPopup(request,sender,sendResponse) {
        this.getCurrentTab().then(tab=>{
            sendResponse(this.checkActivated(tab.id));
        });
        return true;
    },
    /**
     * 現在のタブを取得する。
     * @returns Promise<Tab>
     */
    getCurrentTab(){
        return new Promise(function(resolve,reject) {
            chrome.tabs.query({currentWindow: true, active : true},(tabArray)=>{
                var tab = tabArray[0];
                resolve(tab);
              });
        });
    }
};

