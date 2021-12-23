const psl = require('psl');
const {NestedPropertyAccessor} = C.expr;
const cLogger = C.util.getLogger('func:psl');

exports.disabled = 0;
exports.name = 'fqdn_suffix';
exports.version = '0.1.0';
exports.group = 'Custom Functions';

let conf = {};
let srcField = '_raw';
let dstField;
let overwrite = false;

exports.init = (opt) => {
    conf = (opt || {}).conf || {};

    srcField = new NestedPropertyAccessor((conf.srcField || '_raw').trim());
    dstField = (conf.dstField || '').trim();
    if (dstField) {
        dstField = new NestedPropertyAccessor(dstField);
    }

    overwrite = conf.overwrite || false;
};

exports.process = (event) => {
    try {
         var parsed = psl.parse(srcField.get(event));
    }
    catch (err) {
        cLogger.error("Failed to parse event: " + srcField.get(event), {err} );
    }
    try {
        const value = { "tld": parsed.tld, "sld": parsed.sld, "domain": parsed.domain, "subdomain": parsed.subdomain};

        // Check for overwriting of current field
        const currentValue = dstField.get(event);
        if (!overwrite && currentValue !== undefined) {
            // if the current value is an object, merge fields
            if (currentValue instanceof Object) {
                dstField.set(event, Object.assign({}, currentValue, value) );
            } else {
                // otherwise, create a new object with the "oldvalue" property containing the old value
                dstField.set(event, Object.assign({}, {"oldvalue": currentValue}, value));
            }
        } else {
            dstField.set(event, value);
        }
    } catch (err) {
        cLogger.error("Event parsed, but unable to output objects!", {err});
    }
    return event;
};
