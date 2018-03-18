const dao = require('../config').Dao;
module.exports = function() {
    dao.load().then(config=>{
        var $app = require('./component/option-form.js')(dao);
        $app.config = config;
    });
}