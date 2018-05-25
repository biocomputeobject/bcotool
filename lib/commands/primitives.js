// MAKE node-FORMAT MODULE LOOK LIKE AMD-FORMAT
var define;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function(require) {

/* External */
var moment = require('moment');

/* Internal */
var logger = require('./logger');

var primitives = {

  /**
  * Validates ARRAY datatype
  *
  * @param String value of datatype
  * @api public
  */
  validateARRAY : function (definition, value) {
    if ( typeof value == "object"
      && value.length != undefined ) {
      return true;
    }

    return false;
  },

  /**
  * Validates BOOL datatype
  *
  * @param String value of datatype
  * @api public
  */
  validateBOOL : function (definition, value) {
    // logger.log("value", value);
    
    if ( value === true || value === false
      || value === 1 || value === 0 ) {
      return true;
    }

    return false;
  },

  /**
  * Validates BOOLEAN datatype
  *
  * @param String value of datatype
  * @api public
  */
  validateBOOLEAN : function (definition, value) {
    // // logger.log("value", value);
    
    if ( parseInt(value) === 1 || parseInt(value) === 0 ) {
      return true;
    }

    return false;
  },

  /**
  * Validates DATE datatype
  *
  * @param String value of datatype
  * @api public
  */
  validateDATE : function (definition, value) {
    // // logger.log("value", value);

    var formats = [
        // "Jan 24, 2017"
        "MMM DD, YYYY"
    ];
    var valid = moment(value, formats, true).isValid();
    // // logger.log("valid", valid);

    return valid;
  },

  /**
  * Validates DATETIME datatype
  *
  * @param String value of datatype
  * @api public
  */
  validateDATETIME : function (definition, value) {
    // // logger.log("value", value);

    var formats = [
        // "2015-06-22T13:17:21+0000"
        moment.ISO_8601,
        
        // "Jan 24, 2017 09:40:17"
        "MMM DD, YYYY HH:mm:ss"
    ];
    var valid = moment(value, formats, true).isValid();
    // // logger.log("valid", valid);

    return valid;
  },

  /**
  * Validates HASH datatype
  *
  * @param String value of datatype
  * @api public
  */
  validateHASH : function (definition, value) {
    if ( typeof value == "object"
      && value.length === undefined ) {
      return true;     
    }

    return false;
  },

  /**
  * Validates HIVEARRAY datatype
  *
  * @param String value of datatype
  * @api public
  */
  validateHIVEARRAY : function (definition, value) {
    // logger.log("definition", definition);
    // logger.log("value", value);

    var success = true;
    if ( typeof value == "object" ) {
      if ( definition["_field"] ) {
        for ( var key in value ) {
          // logger.log("key", key);
          // logger.log("value[key]", value[key]);
          // logger.log("typeof value[key]", typeof value[key]);
          var subdefinition = definition["_field"][key];
          // logger.log("subdefinition", subdefinition);

          var subroutine = this.getHiveSubroutine( subdefinition, value[key] );
          // logger.log("subroutine", subroutine);
          if ( subroutine === null
            || this[subroutine] === undefined ) {
            return false;
          }

          var validated = primitives[subroutine]( subdefinition, value[key] );
          // logger.info("validated", validated);

          if ( validated === false ) {
            success = false;
          }

        }
      }
      else {
        for ( var key in value ) {
          if ( typeof value[key] != "object" ) {
            success = false;
          }
        }
      }
    }
    else { 
      success = false;
    }

    // logger.error("RETURNING", success);
    return success;
  },

  getHiveSubroutine : function ( definition, name ) {
    // logger.warn("definition", definition);
    // logger.warn("name", name);

    var datatype = definition["_type"];
    if ( datatype === undefined ) {
      return null;
    }

    // FIX HIVE TYPES
    if ( datatype === "array" ) {
      datatype = "hivearray";
    }

    var subroutine = "validate" + datatype.toUpperCase();

    return subroutine;
  },

  /**
  * Validates HIVEID datatype
  *
  * @param String value of datatype
  * @api public
  */
  validateHIVEID : function (definition, value) {
    // // logger.log("definition", definition);
    // // logger.log("value", value);

    return this.validateOBJECTID( definition, value );
  },

  /**
  * Validates HIVEREGEX datatype
  *
  * @param String value of datatype
  * @api public
  */
  validateHIVEREGEX : function (definition, value) {
    // // logger.log("definition", definition);
    // // logger.log("value", value);

    var regex_value = undefined;
    if ( definition["_limit"] != undefined
      && definition["_limit"]["regex"] != undefined ) {
      regex_value = definition["_limit"]["regex"];

      var regex = new RegExp( regex_value , "" );
      var match = value.toString().match(regex);

      if ( match === null ) {
        // // logger.log("RETURNING FALSE");
        return false;
      }
    }

    // // logger.log("RETURNING TRUE");
    return true;
  },

  /**
  * Validates INT datatype
  *
  * @param String value of datatype
  * @api public
  */
  validateINT : function (definition, value) {
    return this.validateINTEGER( definition, value );
  },

  /**
  * Validates INTEGER datatype
  *
  * @param String value of datatype
  * @api public
  */
  validateINTEGER : function (definition, value) {
    // logger.log("value", value);
    // logger.log("typeof value", typeof value);

    var type = typeof value;
    // logger.log("type", type);
    if ( type === "number" 
      || value.toString().match(/^[\d-]+$/ ) ) {return true;
    }

    return false;
  },

  /**
  * Validates LIST datatype
  *
  * @param String value of datatype
  * @api public
  */
  validateLIST : function (definition, value) {
    // logger.log("value", value);
    return this.validateHASH( definition, value );
  },

  /**
  * Validates NUMBER datatype
  *
  * @param String value of datatype
  * @api public
  */
  validateNUMBER : function (definition, value) {
    // logger.log("value", value);

    var type = typeof value;
    // logger.log("type", type);
    if ( type === "number" 
      || value.toString().match(/^[\d-\.]+$/ ) ) {
        return true;
    }

    return false;
  },

  /**
  * Validates OBJ datatype
  *
  * @param String value of datatype
  * @api public
  */
  validateOBJ : function (definition, value) {
    return this.validateOBJECTID( definition, value );
  },

  /**
  * Validates OBJECT datatype
  *
  * @param String value of datatype
  * @api public
  */
  validateOBJECT : function (definition, value) {
    // // logger.log("value", value);

    if ( typeof value == "object" ) {
      return true;
    }

    return false;
  },

  /**
  * Validates OBJECTID datatype
  *
  * Possible formats:
  *
  * - Integer > 0, e.g. 12345
  * - ASCII string containing 
  *     /[a-z_][a-z0-9_]{0,7}\./ + positive integer > 0
  *     E.g. type.12345
  * - UTF8 string containing a URL ending in an integer > 0
  *     E.g. "https://example.com/BCO/type.12345"
  *
  * @param String value of datatype
  * @api public
  */
  validateOBJECTID : function (definition, value) {
    // logger.trace("value", value);

    var regex = new RegExp( /^(\d+|[a-z_][a-z0-9_]{0,7}\.\d+|http.*:\/\/\S+)$/ , "");
    var match = value.toString().match(regex);

    if ( match === null ) {
      // // logger.log("RETURNING FALSE");
      return false;
    }

    if ( value != undefined ) {
        return true;
    }

    return false;
  },

  /**
  * Validates PERCENTAGE datatype
  *
  * @param String value of datatype
  * @api public
  */
  validatePERCENTAGE : function (definition, value) {
    // // logger.log("value", value);

    if ( typeof value == "number"
      && value >= 0
      && value <= 100 ) {
      return true;
    }

    return false;
  },

  /**
  * Validates REAL datatype
  *
  * @param String value of datatype
  * @api public
  */
  validateREAL : function (definition, value) {
    return this.validateNUMBER( definition, value );
  },

  /**
  * Validates REGEX datatype
  *
  * @param String value of datatype
  * @api public
  */
  validateREGEX : function (definition, value) {
    // // logger.log("definition", definition);
    // // logger.log("value", value);

    var regex_value = definition["value"];
    // regex_value = this.escapeRegex(regex_value);
    var regex = new RegExp( regex_value , "" );
    var match = value.toString().match(regex);

    if ( match === null ) {
      // // logger.log("RETURNING FALSE");
      return false;
    }

    // // logger.log("RETURNING TRUE");
    return true;
  },

  /**
  * Validates STRING datatype
  *
  * @param String value of datatype
  * @api public
  */
  validateSTRING : function (definition, value) {
    // // logger.log("value", value);

    if ( typeof value == "string" ) {
      return true;
    }

    return false;
  },

  /**
  * Validates TEXT datatype
  *
  * @param String value of datatype
  * @api public
  */
  validateTEXT : function (definition, value) {
    // // logger.log("value", value);

    if ( typeof value == "string" ) {
        return true;
    }

    return false;
  },

  /**
  * Validates UINT datatype
  *
  * @param String value of datatype
  * @api public
  */
  validateUINT : function (definition, value) {
    // // logger.log("value", value);

    if ( typeof value == "number"
      && value % 1 === 0
      && value >= 0 ) {
        return true;
    }

    return false;
  }

};

return primitives;

});
