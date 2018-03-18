require('./modules/content')().then(service=>{

    // キャプチャ中のタブを再読み込みした場合には即時activate
    chrome.runtime.sendMessage({type:'check-activated'},(res)=>{
        if(res.activated) {
            service.activate();
        }
    });

    // 状態が変わるごとにactivate/desactivate
    chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
        if(request.type == 'activate') {
            service.activate();
            sendResponse();
        }

        if(request.type == 'desactivate') {
            service.desactivate();
            sendResponse();
        }
    });
});