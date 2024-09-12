/*
 * Dynamic - Declarative DOM behaviour
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/dynamic
 *
 * Released under the MIT license
 * https://github.com/asmblah/dynamic/raw/master/MIT-LICENSE.txt
 */

'use strict';

function ToggleBehaviour() {

}

ToggleBehaviour.prototype.handle = function ($element, options) {
    var $target = options.select('toggle');

    $target.toggleClass('hide');
};

module.exports = ToggleBehaviour;
