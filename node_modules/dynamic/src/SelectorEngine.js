/*
 * Dynamic - Declarative DOM behaviour
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/dynamic
 *
 * Released under the MIT license
 * https://github.com/asmblah/dynamic/raw/master/MIT-LICENSE.txt
 */

'use strict';

var _ = require('microdash');

function SelectorEngine($context) {
    this.$context = $context;
}

SelectorEngine.prototype.select = function ($element, selector) {
    var engine = this,
        functionArgs,
        functionName,
        match;

    // Selector starts with an element-relative combinator
    if (/^\s*[+~>]/.test(selector)) {
        return $element.find(selector);
    }

    // Selector starts with a function
    match = selector.match(/^\s*@([a-z0-9_-]+)\(([^\)]*)\)/i);
    if (match) {
        // Strip function off the selector to leave a (hopefully) valid selector
        selector = selector.substr(match[0].length).replace(/^\s+|\s+$/, '');

        functionName = match[1];
        functionArgs = match[2].split(/\s*,\s*/);

        if (!_.isFunction($element[functionName])) {
            throw new Error('Unsupported selector function "' + match[1] + '"');
        }

        // Call the jQuery method and use its result as the base
        $element = $element[functionName].apply($element, functionArgs);

        // If a selector is specified then search relative to the element,
        // otherwise just return the element
        return selector !== '' ? $element.find(selector) : $element;
    }

    return engine.$context.find(selector);
};

module.exports = SelectorEngine;
