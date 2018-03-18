const $ = require('jquery');
const xpath = require('xpath-dom');

$.fn.xPath = function(xpathExpression) {
    // eachにすべき?
    var dom = this[0];
    return $(xpath.findAll(xpathExpression,dom));
}

$.fn.byXPath = $.fn.xPath;
$.fn.xpath = $.fn.xPath;

module.exports = $;
