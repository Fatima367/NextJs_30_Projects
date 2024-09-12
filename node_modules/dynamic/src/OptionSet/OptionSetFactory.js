/*
 * Dynamic - Declarative DOM behaviour
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/dynamic
 *
 * Released under the MIT license
 * https://github.com/asmblah/dynamic/raw/master/MIT-LICENSE.txt
 */

'use strict';

function OptionSetFactory($, OptionSet, optionReader, selectorEngine) {
    this.$ = $;
    this.optionReader = optionReader;
    this.OptionSet = OptionSet;
    this.selectorEngine = selectorEngine;
}

OptionSetFactory.prototype.create = function (behaviourName, $element, elementConfig) {
    var factory = this;

    return new factory.OptionSet(
        factory.$,
        factory.optionReader,
        factory.selectorEngine,
        behaviourName,
        $element,
        elementConfig || {}
    );
};

module.exports = OptionSetFactory;
