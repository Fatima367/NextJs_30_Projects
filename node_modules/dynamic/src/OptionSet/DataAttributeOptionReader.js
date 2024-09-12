/*
 * Dynamic - Declarative DOM behaviour
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/dynamic
 *
 * Released under the MIT license
 * https://github.com/asmblah/dynamic/raw/master/MIT-LICENSE.txt
 */

'use strict';

function DataAttributeOptionReader() {

}

DataAttributeOptionReader.prototype.get = function ($element, name, behaviourName) {
    if (name !== behaviourName) {
        // Namespace additional behaviour options,
        // so .get('extra') fetches data-dyn-<behav>-extra
        name = behaviourName + '-' + name;
    }

    return $element.data('dyn-' + name);
};

module.exports = DataAttributeOptionReader;
