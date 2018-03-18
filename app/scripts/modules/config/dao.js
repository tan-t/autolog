module.exports = {
    load() {
    return new Promise((resolve,reject)=>{
            chrome.storage.sync.get(DEFAULT_CONFIG,(config)=>{
            resolve(config);
            });
        });
    },
    update(config) {
    return new Promise((resolve,reject)=>{
            chrome.storage.sync.set(config,()=>{
                console.log('saved config', config);
                resolve();
            });
        });
    }
};

const DEFAULT_CONFIG = {
 listeners:[
     {
         selector:'',
         event:'',
         nameSelector:'',
         title:'無題のイベント'
    }
 ],
 noStyle:false
};