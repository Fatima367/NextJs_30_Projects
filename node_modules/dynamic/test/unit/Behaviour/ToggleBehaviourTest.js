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
    OptionSet = require('../../../src/OptionSet/OptionSet'),
    ToggleBehaviour = require('../../../src/Behaviour/ToggleBehaviour');

describe('ToggleBehaviour', function () {
    beforeEach(function () {
        this.$html = $('<html></html>');
        this.$body = $('<body></body>').appendTo(this.$html);
        this.$body.append(
            [
                '<div>',
                '<button id="toggler_button">Toggle</button>',
                '<p id="message_to_toggle">Message to toggle</p>',
                '</div>'
            ].join('\n')
        );
        this.$targetMessage = this.$body.find('#message_to_toggle');
        this.$element = this.$body.find('#toggler_button');
        this.event = $.Event('click');

        this.options = sinon.createStubInstance(OptionSet);
        this.options.select.restore();
        sinon.stub(this.options, 'select', function (name) {
            if (name === 'toggle') {
                return this.$targetMessage;
            }
        }.bind(this));

        this.behaviour = new ToggleBehaviour();
    });

    describe('handle()', function () {
        beforeEach(function () {
            this.callHandle = function () {
                this.behaviour.handle(this.$element, this.options, this.$html, $, this.event);
            }.bind(this);
        });

        it('should add the class "hide" to the message', function () {
            this.callHandle();

            expect(this.$targetMessage.hasClass('hide')).to.be.true;
        });

        it('should remove the class "hide" from the message when called again', function () {
            this.callHandle();
            this.callHandle();

            expect(this.$targetMessage.hasClass('hide')).to.be.false;
        });

        it('should add the class "hide" to the message again when called a third time', function () {
            this.callHandle();
            this.callHandle();
            this.callHandle();

            expect(this.$targetMessage.hasClass('hide')).to.be.true;
        });
    });
});
