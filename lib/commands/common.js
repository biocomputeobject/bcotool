// MAKE node-FORMAT MODULE LOOK LIKE AMD-FORMAT
var define;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function(require) {

/* External */
var logger = require('./logger');
const q = require('q');
const fs = require('fs');

/* Internal */
const util       = require("../utils/util");
const primitives = require("./primitives");

var common = {

  /*
  * Validates a datatypes file using a bco-core.json file.
  * Returns null if no errors. 
  * Otherwise, returns an error hash.
  *
  * @param String data_file containing data to be validated
  * @param String definitions_file containing datatype definitions
  * @api public
  */
  validate : function ( parent, inputs, definition_files ) {
    // logger.log("inputs", inputs);
    // logger.log("DEFAULT definition_files", definition_files);

    var data_file         =   inputs["data_file"];
    var output_file       =   inputs["output_file"];
    // logger.log("data_file", data_file);  
  
    // USE DEFAULT DEFINITIONS FILE IF ABSENT
    if ( inputs["definition_files"] && inputs["definition_files"].length != 0 ) {
      // logger.log("SETTING NON-DEFAULT definition_files", definition_files);
      definition_files = inputs["definition_files"];
    }
    // logger.log("FINAL definition_files", definition_files);

    var deferred = q.defer();
    var thisObj = this;

    setTimeout( function () {

      try {

        // CHECK FILES EXIST
        if ( ! fs.existsSync(data_file) ) {
          // logger.log("data_file DOES NOT EXIST: %s", data_file);
          return deferred.resolve("Can't find data file: " + data_file);
        }
        var data_objects = util.jsonFileToData(data_file);
        // logger.log("data_objects", data_objects);

        // logger.log("GETTING MERGED DEFINITIONS");
        var original_definitions = thisObj.mergeDefinitions( definition_files );
        if ( original_definitions == null ) {
          return deferred.resolve("Could not get original_definitions");
        }
        // // logger.log("original_definitions", original_definitions);

        // SET VARIABLES
        var depth = "";
        var errors = [];

        // VALIDATE
        // logger.log("DOING data_objects", data_objects);

        for ( var data_object_name in data_objects ) {
          // logger.trace("data_object_name", data_object_name);
          var data_object = data_objects[data_object_name];
          // logger.trace("data_object", data_object);
          var current_depth = common.addDepth(depth, data_object_name);

          if ( original_definitions[data_object_name] == undefined
          && depth != "" ) {
            errors.push({
              depth: depth,
              error: "Definition not found for field: " + data_object_name
            });

            continue;
          }

          if ( typeof data_object == "string" ) {
            // logger.log("VALIDATING STRING data_object", data_object);

            var definition = parent.getDefinition( original_definitions, data_objects, original_definitions, data_object, data_object_name)
            // logger.log("definition", definition);
            if ( ! definition ) {
              errors.push({
                depth: depth,
                error: "no definition found for field '" + data_object_name + "'"  
              })
            }
            else {
              errors = thisObj.validateField( parent, original_definitions, data_objects, definition, data_object, current_depth, errors );
            }
          }
          else {
            // logger.log("current_depth", current_depth);
            errors = parent.recursiveValidate(original_definitions, original_definitions, data_objects, data_object, current_depth, errors);
          }
        }
        // logger.log("errors", errors); 

        return deferred.resolve({
          errors: errors
        });
      }
      catch (err) {
        // logger.log("err.message", err.message);
        if (err.stack) {
          // logger.error(err.stack);
        }
        else {
          //// logger.error("err " + "[" + err.lineNumber + "]", err);
           return deferred.resolve(result.stderr);
        }
      }
    },
    50);

    // logger.log("Returning deferred promise", deferred.promise)
    return deferred.promise;
  },

  isChild : function ( depth ) {
    if ( depth == "" ) {
      // logger.error("isChild RETURNING TRUE");
      return true;
    }

    if ( depth.match( /children:[^:]+$/ ) ) {
      // logger.error("isChild RETURNING TRUE");
      return true;
    }

    // logger.error("isChild RETURNING FALSE");
    return false;
  },

  mergeDefinitions : function ( files ) {
    // logger.error("LOADING FILE", files[0]);
    var definitions = util.jsonFileToData( files[0] );
    // // logger.log("INITIAL definitions", definitions);

    for (var i = 1; i < files.length; i++) {
      // logger.error("LOADING FILE", files[i]);

      if ( ! fs.existsSync( files[i] ) ) {
        return null;
      }

      var overriding_definitions = util.jsonFileToData( files[i] );
      definitions = util.mergeHashes( definitions, overriding_definitions ); 
    }
    // // logger.log("FINAL definitions", definitions);

    return definitions;
  },

  validateFieldValues : function ( parent, original_definitions, original_data_objects, definitions, data_object, field_name, field_value, depth, errors ) {
    // logger.trace("definitions", definitions);
    // // logger.trace("original_data_objects", original_data_objects);
    // logger.trace("field_name", field_name);
    // logger.trace("field_value", field_value);
    // logger.trace("data_object", data_object);
    // logger.trace("depth", depth);

    var parent_field_name = common.getFieldFromDepth(depth);
    // logger.trace("parent_field_name", parent_field_name);

    // VALIDATE SUBFIELDS BECAUSE field_value IS AN OBJECT
    if ( common.isObject( field_value )
      && field_name != "values" ) {
      // logger.trace("field_value IS AN OBJECT. DOING SUBFIELDS.    field_value", field_value);

      if ( common.isArray ( field_value ) ) {
        // logger.trace("field_value IS AN ARRAY");

        for (var i = 0; i < field_value.length; i++) {
          // logger.trace("field_value[" + i + "]", field_value[i]);

          if ( common.isHash( field_value[i] ) ) {
            for ( var sub_field_name in field_value[i] ) {
              // logger.trace("sub_field_name", sub_field_name);
  
              var field_definition = parent.getDefinition(  original_definitions, original_data_objects, definitions, data_object, sub_field_name );
              // logger.trace("field_definition", field_definition);

              var current_depth = common.addDepth( depth, i );
              var current_value = field_value[i][sub_field_name];
              // logger.trace("current_value", current_value);

              errors = common.validateField( parent, original_definitions, original_data_objects, field_definition, current_value, current_depth, errors );              
            }
          }
          else {
            var field_definitions = parent.getDefinition( original_definitions, original_data_objects, definitions, data_object, field_name);
            // logger.trace("field_definitions", field_definitions);

            var current_depth = common.addDepth( depth, i );
            // logger.trace("current_depth", current_depth);
            // logger.trace("DOING common.validateField")
            errors = common.validateField( parent, original_definitions, original_data_objects, field_definitions, field_value[i], current_depth, errors );

          }
        }
      }
      else {
        // logger.trace("field_value IS A HASH");
      
        for ( var subfield in field_value ) {
          // logger.trace("subfield", subfield);
          // logger.trace("field_value[" + subfield + "]", field_value[subfield]);
          var field_definitions = parent.getDefinition( original_definitions, original_data_objects, definitions, data_object, subfield );
          // logger.trace("field_definitions", field_definitions);

          errors = parent.validateValues( original_definitions, field_definitions, original_data_objects, field_value[subfield], current_depth + ":" + subfield, errors );
        }
      }

      return errors;
    }

    if ( data_object.length ) {
      field_name = common.getFieldFromDepth(depth);
    }
    // logger.trace("field_name", field_name);
    // logger.trace("definitions", definitions);

    if ( common.supportedField(definitions, field_name) == false ) {

      // logger.trace("common.supportedField() IS FALSE");

      errors.push({
        depth: depth,
        error: "field '" + field_name + "' not supported"
      });
      
      return errors;
    }          

    // PRIORITISE DATATYPE DEFINITON IN DATA OBJECT IF PRESENT 
    // logger.trace("DOING getDefinition");
    // logger.trace("field_name", field_name);
    var definition = parent.getDefinition( original_definitions, original_data_objects, definitions, data_object, field_name );
    // logger.trace("definition", definition);
    if ( ! definition ) {
      errors.push({
        depth: depth,
        error: "field '" + field_name + "' not supported"
      });
      
      return errors;
    }          

    // VALIDATE IF definition HAS CHILDREN
    var child_definitions = definition["children"];
    if ( child_definitions ) {
      // logger.trace("--------------------------- RECURSING child_definitions", child_definitions);
      
      // child_definitions IS AN ARRAY 
      if ( child_definitions.length ) {
        // logger.trace("child_definitions IS AN ARRAY");
        for ( var i = 0; i < child_definitions.length; i++ ) {
          // logger.trace("child_definitions[" + i + "]", child_definitions[i]);
          if ( typeof child_definitions[i] == "object" ) {
            for ( var child_subdefinition in child_definitions[i] ) {
              errors = common.validateField( parent, original_definitions, original_data_objects, child_definitions[i][child_subdefinition], field_value, depth, errors );
            }
          }
          else {
            errors = this.validateField( parent, original_definitions, original_data_objects, child_definitions[i], field_value, depth, errors );
          }
        };
      }
      // child_definitions IS A HASH
      else {
        for ( var child_name in child_definitions ) {
          errors = common.validateField( parent, original_definitions, original_data_objects, child_definitions[child_name], field_name, depth, error );
        }
      }
    }
    // VALIDATE WITH definition
    else {
     // logger.trace("--------------------------- VALIDATING WITH definition", definition);
      errors = common.validateField( parent, original_definitions, original_data_objects, definition, field_value, depth, errors );
    }

    return errors;
  },

/*
  * Call datatype-specific subroutine to validate field_value  
  * E.g.: Validate an integer field by calling validateINTEGER subroutine
  *
  * Returns untouched errors array if no errors. Otherwise, 
  * returns error arrray with additional error added.
  *
  * @param String field_value that is to be validated
  * @param String original_data_objects containing definitions
  * @param String datatype identifying subroutine for field_value
  * @param String depth shows the "breadcrumb-style" position of the error in the data object to be validated
  * @api public
  
*/
  validateField : function ( parent, original_definitions, original_data_objects, definition, value, depth, errors ) {
    // logger.debug("definition", definition);
    // logger.debug("value", value);
    // logger.debug("depth", depth);

    // value IS AN ARRAY
    if ( this.isArray(value) 
        && definition["datatype"] != "LIST" ) {

      // logger.debug("VALUE IS AN ARRAY. DOING validateField");

      for ( var j = 0; j < value.length; j++ ) {
        // logger.debug("value[" + j + "]", value[j]);
        var field_definition = parent.getDefinition( original_definitions, original_data_objects, definition, value, value[j] );
        var current_depth = common.addDepth(depth, "array:" + j);
        // logger.debug("current_depth", current_depth);

        // logger.debug( "VALIDATING WITH FIELD DEFINITION    field_definition", field_definition );
        errors = this.validateField( parent, original_definitions, original_data_objects, field_definition, value[j], current_depth, errors ); 
      }
    }
    // value IS A HASH
    else if ( this.isHash(value) ) {

      // logger.debug("value IS A HASH");
      for ( var subfield in value ) {
        // logger.log("subfield", subfield);
        var sub_definition = parent.getDefinition( original_definitions, original_data_objects, definition, value, subfield);
        // logger.log("sub_definition", sub_definition);

        errors = this.validateField( parent, original_definitions, original_data_objects, sub_definition, value[subfield], depth + ":hash:" + subfield, errors ); 
      }
    }
    // value IS A NUMBER/STRING
    else {

      // logger.debug("value IS A STRING");

      // SANITY CHECK
      if ( depth != "" 
        && ! definition["datatype"] ) {
        errors.push({
          depth: depth,
          // error: "No datatype in definition '"+ JSON.stringify(definition) + "' for value '" + JSON.stringify(value) + "'"
          error: "No datatype in definition for value '" + JSON.stringify(value) + "'"
        })

        return errors;
      }

      // IF values LIST IS PRESENT, ENSURE field_value IS IN IT
      if ( definition["values"] ) {
        errors = common.inValues( definition["values"], value, depth, errors );
      }
      // CHECK IF REQUIRED IF VALUE IS EMPTY
      else if ( ! value || value == "" ) {
        // logger.debug("DOING checkRequired    depth", depth);
        errors = this.checkRequired( errors, definition, depth );
      }
      // OTHERWISE, CALL datatype-SPECIFIC VALIDATION SUBROUTINE
      else {
        // logger.debug("CALLING getSubroutine");

        var field_name = this.getFieldFromDepth( depth );
        // logger.debug("field_name", field_name);

        var subroutine = common.getSubroutine( definition, field_name );
        // var subroutine = 'validate' + datatype.toUpperCase();
        // logger.debug("subroutine", subroutine);

        var validated = primitives[subroutine]( definition, value );
        // logger.debug("validated", validated);
        if ( validated == false ) { 
          errors.push({
            depth: depth,
            error: "field value '" + value
              + "' does not match datatype '"
              + definition["datatype"] + "'"
          });
        }      
      }
    }

    // logger.error("RETURNING errors", errors);

    return errors;
  },

  checkRequired : function ( errors, definition, depth ) {
    // logger.log("VERIFYING REQUIRED VALUE IS NOT EMPTY");
    if ( definition["required"] 
      && definition["required"] == 1 ) {
      // logger.log("***** REQUIRED VALUE IS EMPTY *****");

      errors.push({
        depth: depth,
        error: "Required value is empty or undefined"
      })
    }

    return errors;
  },

  getMatchingDefinition : function ( definitions, data_object ) {
    // logger.trace("definitions", definitions);
    // logger.trace("data_object", data_object);

    // IF data_object IS A SCALAR, RETURN FIRST DEFINITION
    // logger.error("typeof data_object", typeof data_object);
    if ( typeof data_object == "string"
      || definitions.length == 1 ) {
      return definitions[0];
    } 

    // GO SEQUENTIALLY THROUGH THE ARRAY OF DEFINITIONS
    // UNTIL THE FIRST ENTRY WHERE ALL KEYS OF DATA OBJECT ARE FOUND
    for (var i = 0; i < definitions.length; i++) {
      if ( this.allFieldsMatch(definitions[i], data_object) ) {
        return definitions[i];
      }
    };

    return null;
  },

  allFieldsMatch : function ( hash1, hash2 ) {
    // // logger.log("hash1", hash1);
    // // logger.log("hash2", hash2);

    if ( common.hashLength(hash1) != common.hashLength(hash2) ) {
      return false;
    }

    var matched = true;
    for ( var key in hash2 ) {
      if ( ! hash1[key] ) {
        matched = false;
      }
    }
    // logger.log("RETURNING matched", matched);

    return matched;
  },

  isObject : function ( data_object ) {
    if ( typeof data_object == "object" ) {
      return true;
    }

    return false;
  },

  isArray : function ( data_object ) {
    if ( typeof data_object == "object"
      && data_object.length != undefined ) {
      return true;
    }

    return false;
  },

  isHash : function ( data_object ) {
    if ( typeof data_object == "object"
      && data_object.length == undefined ) {
      return true;
    }

    return false;
  },

  getFieldFromDepth : function ( depth ) {
    // logger.warn("depth", depth);
    if ( depth == "" ) {
      return "";
    }

    return depth.match(/([^:]+)[\d:]*$/)[1];
  },

  getSubroutine : function ( definition, name ) {
    // // logger.log("definition", definition);
    // // logger.log("name", name);

    var datatype = "";
    if ( definition[name]
      && definition[name]["datatype"]
       ) {
      datatype = definition[name]["datatype"];
    }
    else {
      datatype = definition["datatype"];
    }
    // // logger.log("datatype", datatype);  

    return "validate" + datatype.toUpperCase();
  },

  hashLength : function ( hash ) {
    var length = 0;
    for ( key in hash ) {
      length++;
    }
    // // logger.log("length", length);

    return length;
  },

  inValues : function ( values, value, depth, errors ) {
    // logger.log("values", values);
    // logger.log("value", value);

    for ( var i = 0; i < values.length; i++ ) {
      if ( values[i] == value ) {
        // logger.log("Returning TRUE");
        return errors;
      } 
    }

    // logger.log("********************* RETURNING ERROR");
    errors.push({
      depth: depth,
      error: "field '" + value + "' not in supported values"
    });

    return errors;
  },

  /**
  * Check field is supported in definitions 
  *
  * @param {Hash} definitions of datatype
  * @api public
  */
  supportedField : function ( definitions, field_name ) {
    // // logger.log("definitions", definitions);
    // // logger.log("field_name", field_name);

    if ( ! (field_name in definitions) ) {
      // // logger.log("Returning FALSE");
      return false;
    }

    // // logger.log("Returning TRUE");
    return true;
  },

  addDepth : function (depth, addition) {
    // // logger.log("depth", depth);
    // // logger.log("addition", addition);
    if ( ! depth ) {
      return addition.toString();
    }

    return depth.toString() + ":" + addition.toString();
  },

   /**
   * Run an asynchronous function.
   * Returns a deferred which eventually resolves.
   *
   * @param {String} name - the name of the Deferred
   * @param {Function} funktion - the function to be run
   */
  _asyncFunction: function( name, funktion ) {
    var thisObj = this;
    var args = Array.prototype.slice.call( arguments, 2 );

    var deferred = q.defer();
    args.unshift( deferred );
    try {
      funktion.apply( thisObj, args ) ;
    } catch( error ) {
      logger.error( error, error.stack );
      deferred.reject( error );
    }

    return deferred.promise;
  }

};

return common;

});
