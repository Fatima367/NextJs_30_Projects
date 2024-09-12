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
    SelectorEngine = require('../../src/SelectorEngine');

describe('SelectorEngine', function () {
    beforeEach(function () {
        this.$context = $([
            '<div id="context">',
            '    <section>',
            '        <div id="element">',
            '            <i id="iElement"></i>',
            '        </div>',
            '        <p id="pElement" class="p-element"></p>',
            '        <p id="pElement2" class="p-element2"></p>',
            '        <h1 id="h1Element" class="h1-element"></h1>',
            '        <h2 id="h2Element" class="h2-element"></h2>',
            '    </section>',
            '</div>'
        ].join(''));
        this.$element = this.$context.find('#element');
        this.$h1Element = this.$context.find('#h1Element');
        this.$iElement = this.$context.find('#iElement');
        this.$pElement = this.$context.find('#pElement');
        this.$pElement2 = this.$context.find('#pElement2');

        this.engine = new SelectorEngine(this.$context);
    });

    describe('select()', function () {
        it('should support a simple selector relative to the context, outside the element', function () {
            expect(this.engine.select(this.$element, '.p-element').is(this.$pElement)).to.be.true;
        });

        it('should support a simple "+" combinator relative to the element', function () {
            var $result = this.engine.select(this.$element, '+ p');

            expect($result).to.have.length(1);
            expect($result.is(this.$pElement)).to.be.true;
        });

        it('should support a simple "~" combinator relative to the element', function () {
            var $result = this.engine.select(this.$element, '~ p');

            expect($result).to.have.length(2);
            expect($result.is(this.$pElement, this.$pElement2)).to.be.true;
        });

        it('should support a simple ">" combinator relative to the element', function () {
            var $result = this.engine.select(this.$element, '> #iElement');

            expect($result).to.have.length(1);
            expect($result.is(this.$iElement)).to.be.true;
        });

        describe('function support', function () {
            it('should support the @closest(...) function used alone', function () {
                var $result = this.engine.select(this.$iElement, '@closest(div)');

                expect($result).to.have.length(1);
                expect($result.is(this.$element)).to.be.true;
            });

            it('should support combinators with the @closest(...) function', function () {
                var $result = this.engine.select(this.$iElement, '@closest(section) > h1');

                expect($result).to.have.length(1);
                expect($result.is(this.$h1Element)).to.be.true;
            });

            it('should throw an error when an invalid function is used', function () {
                expect(function () {
                    this.engine.select(this.$element, '@invalidfunc()');
                }.bind(this)).to.throw('Unsupported selector function "invalidfunc"');
            });
        });
    });
});
