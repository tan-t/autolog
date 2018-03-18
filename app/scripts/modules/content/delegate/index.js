const matcher = require('./matcher.js');
/**
     * 親要素以下の要素に対するイベントを動的にリッスンする  
     * jQueryのdelegateの仕組みを使いたかったが、  
     * xpathで指定できないため自作。  
     * @param {string} selector CSS Selectorかxpath
     * @param {Function} handler 
     */
var getDelegate = function(selector,handler) {
        return function(e) {
            for (var target=e.target; target && target!=this; target=target.parentNode) {
                if (matcher(target,selector)) {
                    handler.call(null,target);
                    break;
                }
            }
        }
}

module.exports = getDelegate;