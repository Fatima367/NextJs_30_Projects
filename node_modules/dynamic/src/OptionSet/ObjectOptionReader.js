/*
 * Dynamic - Declarative DOM behaviour
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/dynamic
 *
 * Released under the MIT license
 * https://github.com/asmblah/dynamic/raw/master/MIT-LICENSE.txt
 */

'use strict';

function ObjectOptionReader() {

}

ObjectOptionReader.prototype.get = function ($element, name, behaviourName, elementConfig) {
    return elementConfig[name];
};

module.exports = ObjectOptionReader;
