const Messenger = require('./messenger');
module.exports = function() {
    var $app = require('./component/menu.js')(Messenger);
    Messenger.checkActivated().then(activated=>{
        $app.recording = activated;
    });
    return $app;
}