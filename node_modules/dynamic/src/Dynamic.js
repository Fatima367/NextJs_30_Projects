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

function Dynamic(dataAttributeOptionSetFactory, objectOptionSetFactory, $, $context) {
    this.$ = $;
    this.behaviours = {};
    this.$context = $context;
    this.dataAttributeOptionSetFactory = dataAttributeOptionSetFactory;
    this.objectOptionSetFactory = objectOptionSetFactory;
}

_.extend(Dynamic.prototype, {
    addBehaviour: function (name, handler) {
        var dynamic = this;

        dynamic.behaviours[name] = handler;

        return dynamic;
    },

    applyTo: function ($container) {
        var dynamic = this,
            $ = dynamic.$;

        _.each(dynamic.behaviours, function (handler, behaviourName) {
            $container.find('[data-dyn-' + behaviourName + '-on]').each(function () {
                var $element = $(this),
                    onEvent = $element.data('dyn-' + behaviourName + '-on'),
                    options = dynamic.dataAttributeOptionSetFactory.create(
                        behaviourName,
                        $element
                    );

                $element.on(onEvent, function (event) {
                    handler($element, options, dynamic.$context, $, event);
                });

                $element.trigger('init');
            });
        });

        dynamic.$context.find('script[type="text/x-dyn-json"]').each(function () {
            var json = $(this).html(),
                config = JSON.parse(json);

            _.forOwn(config, function (elementConfig, selector) {
                function handleConfig(elementConfig) {
                    $container.find(selector).each(function () {
                        var $element = $(this),
                            onEvent = elementConfig.on,
                            options = dynamic.objectOptionSetFactory.create(
                                elementConfig.behaviour,
                                $element,
                                elementConfig
                            ),
                            handler = dynamic.behaviours[elementConfig.behaviour];

                        if (!handler) {
                            throw new Error(
                                'No behaviour called "' + elementConfig.behaviour + '" is defined'
                            );
                        }

                        $element.on(onEvent, function (event) {
                            handler($element, options, dynamic.$context, $, event);
                        });

                        $element.trigger('init');
                    });
                }

                if (_.isArray(elementConfig)) {
                    _.each(elementConfig, handleConfig);
                } else {
                    handleConfig(elementConfig);
                }
            });
        });

        return dynamic;
    },

    use: function (plugin) {
        var dynamic = this;

        plugin(dynamic);

        return dynamic;
    }
});

module.exports = Dynamic;
