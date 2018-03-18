module.exports = {
    sendStartMessage() {
        return new Promise((resolve,reject)=>{
            chrome.runtime.sendMessage({type:'toggle-tab-capture'},(res)=>{
                console.log(res);
                resolve(res.activated);
            });
        });
    },
    sendStopMessage() {
        return new Promise((resolve,reject)=>{
            chrome.runtime.sendMessage({type:'toggle-tab-capture'},(res)=>{
                console.log(res);
                resolve(res.activated);
            });
        });
    },
    /**
     * 
     * @param {string} memo 
     */
    sendLogMessage(memo) {
        return new Promise((resolve,reject)=>{
            chrome.runtime.sendMessage({type:'shot-request-popup',message:{title:'クイックログ',log:memo}},(res)=>{
                console.log(res);
                resolve(res.activated);
            });
        });
    },
    checkActivated() {
        return new Promise((resolve,reject)=>{
            chrome.runtime.sendMessage({type:'check-activated-popup'},(res)=>{
                console.log(res);
                resolve(res.activated);
            });
        });
    }
};