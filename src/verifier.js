"use strict";
module.exports = verifier;

var Enum      = require("./enum"),
    util      = require("./util");

function invalid(field, expected) {
    return field.name + ": " + expected + (field.repeated && expected !== "array" ? "[]" : field.map && expected !== "object" ? "{k:"+field.keyType+"}" : "") + " expected";
}

/**
 * Generates a partial value verifier.
 * @param {Field} field Reflected field
 * @param {number} fieldIndex Field index
 * @param {string} ref Variable reference
 * @returns {Codegen} Codegen instance
 * @ignore
 */
function genVerifyValue(field, fieldIndex, ref, options){
    /* eslint-disable no-unexpected-multiline */
    var _types = options.types;
    if(field.resolvedType){
        if(field.resolvedType instanceof Enum){
            for(var k in field.resolvedType.values){
                if(field.resolvedType.values[k]===ref) return ;
            }
            return invalid(field, "enum value");
        }else {
            var e = _types[fieldIndex].verify(ref);
            if(e)
                return field.name + "."+ e;
        }
    } else {
        switch (field.type) {
            case "int32":
            case "uint32":
            case "sint32":
            case "fixed32":
            case "sfixed32":
                if (!util.isInteger(ref))
                    return invalid(field, "integer");
                break;
            case "int64":
            case "uint64":
            case "sint64":
            case "fixed64":
            case "sfixed64":
                if(!util.isInteger(ref)&&!(ref&&util.isInteger(ref.low)&&util.isInteger(ref.high)))
                    return invalid(field, "integer|Long");
                break;
            case "float":
            case "double":
                if(typeof ref!=="number")
                    return invalid(field, "number");
                break;
            case "bool":
                if(typeof ref!=="boolean")
                    return invalid(field, "boolean");
                break;
            case "string":
                if(!util.isString(ref))
                    return invalid(field, "string");
                break;
            case "bytes":
                if(!(ref&&typeof ref.length==="number"||util.isString(ref)))
                    return invalid(field, "buffer");
                break;
        }
    }
    /* eslint-enable no-unexpected-multiline */
}

/**
 * Generates a partial key verifier.
 * @param {Field} field Reflected field
 * @param {string} ref Variable reference
 * @returns {Codegen} Codegen instance
 * @ignore
 */
function genVerifyKey(field, ref) {
    /* eslint-disable no-unexpected-multiline */
    switch(field.keyType){
        case "int32":
        case "uint32":
        case "sint32":
        case "fixed32":
        case "sfixed32":
            if(!util.key32Re.test(ref))
                return invalid(field, "integer key");
            break;
        case "int64":
        case "uint64":
        case "sint64":
        case "fixed64":
        case "sfixed64":
            if(!util.key64Re.test(ref))
                return invalid(field, "integer|Long key");
            break;
        case "bool":
            if(!util.key2Re.test(ref))
                return invalid(field, "boolean key");
            break;
    }
    /* eslint-enable no-unexpected-multiline */
}

/**
 * Generates a verifier specific to the specified message type.
 * @param {Type} mtype Message type
 * @returns {Codegen} Codegen instance
 */
function verifier(mtype) {
    /* eslint-disable no-unexpected-multiline */

    return function (options){
        return function (m){
            var invalidDes;
            if(typeof m !== 'object' || m === null)
                return "object expected";

            var oneofs = mtype.oneofsArray,
                seenFirstField = {};
            var p;
            if(oneofs.length)
                p = {};
            for (var i = 0; i < mtype.fieldsArray.length; ++i){
                var field = mtype._fieldsArray[i].resolve(),
                    ref   = m[field.name];
                if(!field.optional || (ref!=null&& m.hasOwnProperty(field.name))){
                    var  _i;
                    if (field.map){
                        if(!util.isObject(ref))
                            return invalid(field, "object");
                        var k=Object.keys(ref);
                        for (_i = 0; _i < k.length; ++_i){
                            //检查key值的合法性
                            invalidDes = genVerifyKey(field, k[_i]);
                            if(invalidDes){
                                return invalidDes;
                            }
                            //检查value值的合法性
                            invalidDes = genVerifyValue(field, i, ref[k[_i]], options);
                            if(invalidDes){
                                return invalidDes;
                            }
                        }
                    } else if(field.repeated){
                        if(!Array.isArray(ref)){
                            return invalid(field, "array");
                        }

                        for (_i = 0; _i < ref.length; ++_i) {
                            invalidDes = genVerifyValue(field, i, ref[_i], options);
                            if(invalidDes){
                                return invalidDes;
                            }
                        }
                    } else {
                        if(field.partOf) {
                            var  oneofPropName = field.partOf.name;
                            if (seenFirstField[field.partOf.name] === 1)
                                if(p[oneofPropName] === 1)
                                    return field.partOf.name + ": multiple values";
                            p[oneofPropName] = 1
                        }
                        invalidDes = genVerifyValue(field, i, ref, options);
                        if(invalidDes){
                            return invalidDes;
                        }
                    }
                }
            }
            return null;
        }
    }
    /* eslint-enable no-unexpected-multiline */
}