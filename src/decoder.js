"use strict";
module.exports = decoder;

var Enum    = require("./enum"),
    types   = require("./types"),
    util    = require("./util");

function missing(field) {
    return "missing required '" + field.name + "'";
}

/**
 * Generates a decoder specific to the specified message type.
 * @param {Type} mtype Message type
 * @returns {Codegen} Codegen instance
 */
function decoder(mtype) {
    /* eslint-disable no-unexpected-multiline */
    return function (options){
        var Reader = options.Reader;
        var _types = options.types;
        var _util   = options.util;
        return function (r, l){
            if(!(r instanceof Reader))
                r = Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l,
                m = new this.ctor;
            var k,value;
            while (r.pos < c){
                var t = r.uint32();
                if (mtype.group){
                    if((t&7) === 4)
                        break;
                }
                var fieldId = t>>>3;
                var i = 0;
                var find = false;
                for (; i < mtype.fieldsArray.length; ++i){
                    var field = mtype._fieldsArray[i].resolve(),
                        name  = field.name,
                        type  = field.resolvedType instanceof Enum ? "int32" : field.type;
                    //ref   = m[field.name];    //下面有赋值,不能直接用ref 还不如用m[name]
                    if (fieldId != field.id) continue;
                    find = true;
                    if (field.map){
                        // r.skip().pos++;
                        if(m[name] === _util.emptyObject)
                            m[name] = {};
                        var c2=r.uint32()+r.pos;
                        if(types.defaults[field.keyType]!==undefined)
                            k=types.defaults[field.keyType];
                        else
                            k=null;
                        if(types.defaults[type]!==undefined)
                            value=types.defaults[type];
                        else
                            value=null;
                        while (r.pos<c2){
                            var tag2=r.uint32();
                            switch (tag2>>>3){
                                case 1: k=r[field.keyType]();break;
                                case 2:
                                    if(types.basic[type] === undefined)
                                        value=_types[i].decode(r,r.uint32()); // can't be groups
                                    else
                                        value=r[type]();
                                    break;
                                default:
                                    r.skipType(tag2&7);
                                    break;
                            }
                        }
                        if(types.long[field.keyType]!==undefined)
                            m[name][typeof k ==='object' ? _util.longToHash(k):k]=value;
                        else
                            m[name][k]=value;

                    }else if(field.repeated){
                        if(!(m[name] && m[name].length)){
                            m[name] = [];
                        }

                        if(types.packed[type] !== undefined && (t&7) === 2){
                            var c2 = r.uint32()+ r.pos;
                            while (r.pos < c2)
                                m[name].push(r[type]())
                        }else {
                            if(types.basic[type] === undefined){
                                field.resolvedType.group ?
                                    m[name].push(_types[i].decode(r)) :
                                    m[name].push(_types[i].decode(r, r.uint32()))

                            }else {
                                m[name].push(r[type]());
                            }
                        }
                    }else if (types.basic[type] === undefined){
                        if(field.resolvedType.group){
                            m[name] = _types[i].decode(r);
                        }else {
                            m[name] = _types[i].decode(r, r.uint32());
                        }
                    }else {
                        //console.log("m",JSON.stringify(m),"type",type,"field",field);
                        m[name] = r[type]();
                    }
                    break;
                }

                if(!find){
                    console.log("t",t);
                    r.skipType(t&7)
                }

            }

            for (i = 0; i < mtype._fieldsArray.length; ++ i){
                var rfield = mtype._fieldsArray[i];
                if(rfield.required){
                    if(!m.hasOwnProperty(rfield.name)){
                        throw util.ProtocolError(missing(rfield),{instance:m})
                    }
                }
            }
            //mtype.fieldsArray.filter(function(field) { return field.map; }).length
            return m;
        }
    }
    /* eslint-enable no-unexpected-multiline */
}
