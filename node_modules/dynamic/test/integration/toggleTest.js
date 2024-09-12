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
    dynamic = require('../..');

describe('Toggle behaviour integration', function () {
    beforeEach(function () {
        this.$html = $('<html></html>');
        this.$body = $('<body></body>').appendTo(this.$html);
        this.$body.append(
            [
                '<div>',
                '<button ',
                'id="toggler_button" ',
                'data-dyn-toggle-on="click" ',
                'data-dyn-toggle="#message_to_toggle"',
                '>Toggle</button>',
                '<p id="message_to_toggle">Message to toggle</p>',
                '</div>'
            ].join('\n')
        );
        this.$targetMessage = this.$body.find('#message_to_toggle');
        this.$element = this.$body.find('#toggler_button');
        this.event = $.Event('click');

        this.dynamic = dynamic.create($, this.$html);
    });

    describe('when applied to the document', function () {
        beforeEach(function () {
            this.applyToDocument = function () {
                this.dynamic.applyTo(this.$html);
            }.bind(this);
        });

        it('should add the class "hide" to the message when triggered', function () {
            this.applyToDocument();

            this.$element.trigger(this.event);

            expect(this.$targetMessage.hasClass('hide')).to.be.true;
        });

        it('should remove the class "hide" from the message when triggered again', function () {
            this.applyToDocument();

            this.$element.trigger(this.event);
            this.$element.trigger(this.event);

            expect(this.$targetMessage.hasClass('hide')).to.be.false;
        });

        it('should add the class "hide" to the message again when triggered a third time', function () {
            this.applyToDocument();

            this.$element.trigger(this.event);
            this.$element.trigger(this.event);
            this.$element.trigger(this.event);

            expect(this.$targetMessage.hasClass('hide')).to.be.true;
        });
    });
});
