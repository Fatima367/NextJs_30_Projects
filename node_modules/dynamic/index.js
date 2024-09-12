/*
 * Dynamic - Declarative DOM behaviour
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/dynamic
 *
 * Released under the MIT license
 * https://github.com/asmblah/dynamic/raw/master/MIT-LICENSE.txt
 */

'use strict';

var expressionEvaluator = require('expression-eval'),
    Dynamic = require('./src/Dynamic'),
    DataAttributeOptionReader = require('./src/OptionSet/DataAttributeOptionReader'),
    ObjectOptionReader = require('./src/OptionSet/ObjectOptionReader'),
    OptionReader = require('./src/OptionSet/OptionReader'),
    OptionSet = require('./src/OptionSet/OptionSet'),
    OptionSetFactory = require('./src/OptionSet/OptionSetFactory'),
    SelectorEngine = require('./src/SelectorEngine'),
    ToggleBehaviour = require('./src/Behaviour/ToggleBehaviour');

module.exports = {
    create: function ($, $root) {
        var $context = $root || $('html'),
            expressionContext = {$: $},
            dataAttributeOptionReader = new OptionReader(
                new DataAttributeOptionReader(),
                expressionContext,
                expressionEvaluator
            ),
            objectOptionReader = new OptionReader(
                new ObjectOptionReader(),
                expressionContext,
                expressionEvaluator
            ),
            selectorEngine = new SelectorEngine($context),
            dataAttributeOptionSetFactory = new OptionSetFactory(
                $,
                OptionSet,
                dataAttributeOptionReader,
                selectorEngine
            ),
            objectOptionSetFactory = new OptionSetFactory(
                $,
                OptionSet,
                objectOptionReader,
                selectorEngine
            ),
            dynamic = new Dynamic(
                dataAttributeOptionSetFactory,
                objectOptionSetFactory,
                $,
                $context
            ),
            toggleBehaviour = new ToggleBehaviour();

        // Add the default 'toggle' behaviour
        dynamic.addBehaviour('toggle', $.proxy(toggleBehaviour.handle, toggleBehaviour));

        return dynamic;
    }
};
