/*
 * Dynamic - Declarative DOM behaviour
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/dynamic
 *
 * Released under the MIT license
 * https://github.com/asmblah/dynamic/raw/master/MIT-LICENSE.txt
 */

'use strict';

var $ = require('jquery'),
    DataAttributeOptionReader = require('../../../src/OptionSet/DataAttributeOptionReader');

describe('DataAttributeOptionReader', function () {
    beforeEach(function () {
        this.$element = $('<div></div>');
        this.$element.attr('data-dyn-my-behaviour', 'root value');
        this.$element.attr('data-dyn-my-behaviour-arg1', 'value of arg1');
        this.$element.attr('data-dyn-my-behaviour-arg2', 'value of arg2');
        this.$element.attr('data-dyn-my-behaviour-evaled-arg-expr', 'my.expr === 2');

        this.reader = new DataAttributeOptionReader();
    });

    describe('get()', function () {
        it('should be able to fetch the root value by the behaviour name', function () {
            expect(this.reader.get(this.$element, 'my-behaviour', 'my-behaviour')).to.equal('root value');
        });

        it('should be able to fetch an argument for the behaviour by its name', function () {
            expect(this.reader.get(this.$element, 'arg1', 'my-behaviour')).to.equal('value of arg1');
        });
    });
});
