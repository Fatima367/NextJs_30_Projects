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
    sinon = require('sinon'),
    OptionReader = require('../../../src/OptionSet/OptionReader'),
    OptionSet = require('../../../src/OptionSet/OptionSet'),
    SelectorEngine = require('../../../src/SelectorEngine');

describe('OptionSet', function () {
    beforeEach(function () {
        this.$element = $('<div></div>');
        this.$target = $('<div></div>');
        this.expressionContext = {
            myArg: 21
        };
        this.optionReader = sinon.createStubInstance(OptionReader);
        this.selectorEngine = sinon.createStubInstance(SelectorEngine);
        this.optionReader.get.withArgs(this.$element, 'my-option').returns('my value');
        this.optionReader.get.withArgs(this.$element, 'my-selector').returns('#mySelector');

        this.optionSet = new OptionSet(
            $,
            this.optionReader,
            this.selectorEngine,
            'my-behaviour',
            this.$element,
            {}
        );
    });

    describe('get()', function () {
        it('should return the result from the OptionReader', function () {
            expect(this.optionSet.get('my-option')).to.equal('my value');
        });
    });

    describe('select()', function () {
        it('should use the SelectorEngine to find the element(s) when a selector is returned', function () {
            this.selectorEngine.select.withArgs(this.$element, '#mySelector').returns(this.$target);

            expect(this.optionSet.select('my-selector')).to.equal(this.$target);
        });

        it('should pass through a collection without using the SelectorEngine', function () {
            var $result = $('<div></div>');

            this.optionReader.get.withArgs(this.$element, 'my-selector').returns($result);

            expect(this.optionSet.select('my-selector')).to.equal($result);
        });

        it('should pass undefined when the default collection is not specified', function () {
            this.optionSet.select('my-selector');

            expect(this.optionReader.get).to.have.been.calledWith(
                sinon.match.any,
                sinon.match.any,
                sinon.match.any,
                undefined
            );
        });

        it('should pass null when the default collection is specified', function () {
            this.optionSet.select('my-selector', $('<div></div>'));

            expect(this.optionReader.get).to.have.been.calledWith(
                sinon.match.any,
                sinon.match.any,
                sinon.match.any,
                null
            );
        });

        it('should return the default collection when specified and the option is missing', function () {
            var $defaultCollection = $('<div></div>');

            this.optionReader.get.withArgs(this.$element, 'my-selector').returns(null);

            expect(this.optionSet.select('my-selector', $defaultCollection)).to.equal($defaultCollection);
        });
    });
});
