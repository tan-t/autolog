module.exports = {
    load() {
    return new Promise((resolve,reject)=>{
            chrome.storage.sync.get(DEFAULT_CONFIG,(config)=>{
            resolve(this.complement(config));
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
    },
    complement(config) {
        config.listeners.forEach(listener => {
            listener.unlisten = ( listener.unlisten === true );
        });

        return config;
    }
};

const DEFAULT_CONFIG = {
 listeners:[
     {
         selector:'',
         event:'',
         nameSelector:'',
         title:'無題のイベント',
         unlisten : false
    }
 ],
 noStyle:false
};