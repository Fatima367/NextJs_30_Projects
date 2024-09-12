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
    ObjectOptionReader = require('../../../src/OptionSet/ObjectOptionReader'),
    OptionReader = require('../../../src/OptionSet/OptionReader');

describe('OptionReader', function () {
    beforeEach(function () {
        this.$element = $('<div></div>');
        this.expressionContext = {
            myArg: 21
        };
        this.eval = sinon.stub();
        this.parse = sinon.stub();
        this.expressionEvaluator = {
            eval: this.eval,
            parse: this.parse
        };
        this.optionReader = sinon.createStubInstance(ObjectOptionReader);
        this.optionReader.get.withArgs(sinon.match.any, 'my-behaviour', 'my-behaviour').returns('root value');
        this.optionReader.get.withArgs(sinon.match.any, 'arg1', 'my-behaviour').returns('value of arg1');
        this.optionReader.get.withArgs(sinon.match.any, 'arg2', 'my-behaviour').returns('value of arg2');
        this.optionReader.get.withArgs(sinon.match.any, 'evaled-arg-expr', 'my-behaviour').returns('1 + 2');

        this.parse.withArgs('1 + 2').returns({
            type: 'BinaryExpression',
            operator: '+',
            left: {
                type: 'Literal',
                value: 1,
                raw: '1'
            },
            right: {
                type: 'Literal',
                value: 2,
                raw: '2'
            }
        });
        this.eval.withArgs({
            type: 'BinaryExpression',
            operator: '+',
            left: {
                type: 'Literal',
                value: 1,
                raw: '1'
            },
            right: {
                type: 'Literal',
                value: 2,
                raw: '2'
            }
        }).returns(3);

        this.reader = new OptionReader(this.optionReader, this.expressionContext, this.expressionEvaluator);
    });

    describe('get()', function () {
        it('should be able to fetch the root value by the behaviour name', function () {
            expect(this.reader.get(this.$element, 'my-behaviour', 'my-behaviour')).to.equal('root value');
        });

        it('should be able to fetch an argument for the behaviour by its name', function () {
            expect(this.reader.get(this.$element, 'arg1', 'my-behaviour')).to.equal('value of arg1');
        });

        it('should support evaluated expressions', function () {
            expect(this.reader.get(this.$element, 'evaled-arg', 'my-behaviour')).to.equal(3);
        });

        it('should pass the context to the evaluator', function () {
            this.expressionEvaluator.eval.returns('my evaled result');

            this.reader.get(this.$element, 'evaled-arg', 'my-behaviour');

            expect(this.expressionEvaluator.eval).to.have.been.calledOnce;
            expect(this.expressionEvaluator.eval).to.have.been.calledWith(
                sinon.match.any,
                sinon.match({myArg: 21})
            );
        });

        it('should pass the element in the context as $this', function () {
            this.expressionEvaluator.eval.returns('my evaled result');

            this.reader.get(this.$element, 'evaled-arg', 'my-behaviour');

            expect(this.expressionEvaluator.eval).to.have.been.calledOnce;
            expect(this.expressionEvaluator.eval).to.have.been.calledWith(
                sinon.match.any,
                sinon.match({'$this': this.$element})
            );
        });

        it('should return the default when specified and neither the arg nor its expression variant are present', function () {
            expect(this.reader.get(this.$element, 'unspecified-arg', 'my-behaviour', 'my default value'))
                .to.equal('my default value');
        });

        it('should throw when neither the arg nor its expression variant are present with no default', function () {
            expect(function () {
                this.reader.get(this.$element, 'invalid-arg', 'my-behaviour');
            }.bind(this)).to.throw(
                'Neither "invalid-arg" nor "invalid-arg-expr" options were specified'
            );
        });
    });
});
