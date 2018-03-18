
var showPageComponent = require('./modules/showpage/component')();
var CaptureService = require('./modules/showpage/service')(showPageComponent);

chrome.runtime.sendMessage({type:'greet'},(res)=>{
    showPageComponent.blobUrl = res.blobUrl; 
});

// listen to state change
chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
    if(request.type == 'reactivate') {
        showPageComponent.blobUrl = request.message.blobUrl; 
        console.log('service reactivated.');
        sendResponse();
    }
});