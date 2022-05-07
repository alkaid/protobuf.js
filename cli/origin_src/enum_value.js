"use strict";
module.exports = EnumValue;

// extends ReflectionObject
var ReflectionObject = require("./object");
((EnumValue.prototype = Object.create(ReflectionObject.prototype)).constructor = EnumValue).className = "EnumValue";

var Namespace = require("./namespace"),
    util = require("./util");

/**
 * Constructs a new EnumValue instance.
 * @classdesc Reflected EnumValue.
 * @extends ReflectionObject
 * @constructor
 * @param {string} name Unique name within its namespace
 * @param {string|number} [value] EnumValue values as an object, by name
 * @param {Object.<string,*>} [options] Declared options
 * @param {string} [comment] The comment for this EnumValue
 * @param {Object.<string,string>} [comments] The value comments for this EnumValue
 */
function EnumValue(name, value, options, comment, comments) {
    ReflectionObject.call(this, name, options);

    if (value && typeof value === "object")
        throw TypeError("value must not be an object");

   this.value=value

    /**
     * EnumValue comment text.
     * @type {string|null}
     */
    this.comment = comment;

    /**
     * Value comment texts, if any.
     * @type {Object.<string,string>}
     */
    this.comments = comments || {};

}

/**
 * EnumValue descriptor.
 * @interface IEnumValue
 * @property {string|number} value EnumValue value
 * @property {Object.<string,*>} [options] EnumValue options
 */

/**
 * Constructs an EnumValue from an EnumValue descriptor.
 * @param {string} name EnumValue name
 * @param {IEnumValue} json EnumValue descriptor
 * @returns {EnumValue} Created EnumValue
 * @throws {TypeError} If arguments are invalid
 */
EnumValue.fromJSON = function fromJSON(name, json) {
    var enm = new EnumValue(name, json.value, json.options, json.comment, json.comments);
    return enm;
};

/**
 * Converts this EnumValue to an EnumValue descriptor.
 * @param {IToJSONOptions} [toJSONOptions] JSON conversion options
 * @returns {IEnumValue} EnumValue descriptor
 */
EnumValue.prototype.toJSON = function toJSON(toJSONOptions) {
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util.toObject([
        "options"  , this.options,
        "value"   , this.value,
        // "name",this.name,
        // "fullName",this.fullName,
        "comment"  , keepComments ? this.comment : undefined,
        "comments" , keepComments ? this.comments : undefined
    ]);
};
