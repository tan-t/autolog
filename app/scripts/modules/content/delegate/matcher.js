const $ = require('../jquery-xpath');
const looksLikeXpath = /^\/\/.*/;
module.exports = function(dom,selector) {
        if(!looksLikeXpath.test(selector)){
            return dom.matches(selector);
        }

        var matches = $(dom.document || dom.ownerDocument).xPath(selector);
        var i = matches.length;

        while( --i >= 0 && matches[i] !== dom) {}
        return i > -1;
}