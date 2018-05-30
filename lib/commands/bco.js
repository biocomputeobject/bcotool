// MAKE node-FORMAT MODULE LOOK LIKE AMD-FORMAT
var define;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function(require) {

/* External */
var logger = require('./logger');
var JSON = require('JSON');
const fs = require('fs');
var q = require('q');

/* Internal */
var logger = require('./logger');
var util       = require("../utils/util");
var common     = require("./common");

var validator = {

  util : util,

  definition_files : [
    __dirname + "/../../data/datatypes.json",
    __dirname + "/../../data/spec.json",
  ],

  validate : function (inputs) {
    // NB: common.validate GETS DATA FROM FILES THEN 
    // CALLS this.recursiveValidate

    var parent = this;
    return common.validate(parent, inputs, this.definition_files);
  },

/*
  * Recursively validate a nested datatype
  *
  * Checks the following:
  *   - Required fields are present
  *   - Definition is available for all fields
  *   - Fields only have allowed values
  *
  * Returns the original error array passed in first call of method.
  * Otherwise, returns error array with added errors.
  *
  * @param Object original_definitions contains definitions for all datatypes
  * @param Object definitions contains definitions for the specific data object
  * @param Object original_data_objects contains data object passed to first call of the method (i.e., no recursion yet)
  * @param Object data_object contains the subcomponent of original data object being passed to recursive call of the method
  * @param String depth shows the "breadcrumb-style" position of the error in the data object to be validated
  * @param Object errors contains list of error objects
  * @api public
*/
  recursiveValidate : function ( original_definitions, definitions, original_data_objects, data_object, depth, errors ) {
    // // logger.log("--------------definitions", definitions);
    // logger.log("--------------data_object", data_object);
    // // logger.log("--------------original_data_objects", original_data_objects);
    // logger.log("--------------depth", depth);
    // logger.log("--------------errors", errors);

    // LOOP IF DATA OBJECT IS A HASH
    if ( common.isHash( data_object ) ) {
      // logger.info("LOOPING BECAUSE data_object IS A HASH   depth", depth);

      var field_name = common.getFieldFromDepth(depth);
      // logger.log("field_name", field_name);

      var sub_sub_definitions = this.getDefinition( original_definitions, original_data_objects, definitions, data_object, field_name );
      // logger.log("--------------sub_sub_definitions", sub_sub_definitions);

      if ( sub_sub_definitions == null ) {
        errors.push({
          depth: depth,
          error: "Definition not found for field: " + depth
        });
      }
      else {
        errors = this.loopValidation( original_definitions, sub_sub_definitions, original_data_objects, data_object, depth, errors );
      }

      // logger.error("LOOP " + field_name + " errors", errors);      
    }
    // RECURSE IF DATA OBJECT IS AN ARRAY
    else if ( common.isArray( data_object ) ) {
      // logger.info("RECURSING BECAUSE data_object IS AN ARRAY   depth", depth);

      for (var i = 0; i < data_object.length; i++) {
        var object_name = common.getFieldFromDepth( depth );
        // logger.log("--------------object_name", object_name);
        var definition = this.getDefinition( original_definitions, original_data_objects, definitions, data_object[i], object_name );
        // logger.trace("--------------definition", definition);

        if ( ! definition || definition == null ) {
          errors.push({
            depth: depth + ":" + i,
            error: "Definition not found for field: " + object_name
          });
        }
        else {
          errors = this.recursiveValidate( original_definitions, definition, original_data_objects, data_object[i], depth + ":" + i, errors );
        }

        // logger.error("RECURSION " + i + " errors", errors);
      }
    } 

    // IF data_object IS NOT A HASH OR ARRAY, JUST VALIDATE VALUES
    else {
      // logger.warn("DATA OBJECT IS NOT A HASH OR ARRAY. DOING validateValues    depth", depth);

      errors = this.validateValues( original_definitions, definitions, original_data_objects, data_object, data_object, depth, errors );
    }

    // logger.info("Returning errors", errors);
    return errors;
  },

  loopValidation : function (original_definitions, definitions, original_data_objects, data_object, depth, errors) {
    // logger.info("--------------definitions", definitions);
    // logger.info("--------------data_object", data_object);
    // logger.info("--------------original_data_objects", original_data_objects);
    // logger.info("--------------depth", depth);
    // logger.info("--------------errors", errors);

    for ( var name in data_object ) {
      // logger.info("--------------name", name);
      var value = data_object[name];
      // logger.info("--------------value", value);

      var current_depth = common.addDepth( depth, name );
      // logger.info("-------------- current_depth", current_depth);

      if ( common.isArray(value) ) {
        // logger.info("--------------value IS AN ARRAY");

        for (var i = 0; i < value.length; i++) {
          // logger.info("-------------- DOING this.validateValues FOR value[" + i + "]", value[i]);

          var sub_definitions = this.getDefinition( original_definitions, original_data_objects, definitions, value[i], name );
          // logger.info("-------------- sub_definitions", sub_definitions);

          for ( var key in value[i] ) {
            // logger.info("-------------- ^^^^^^^^^^^ key: " + key + " ^^^^^^^^^^^");

            var sub_sub_definitions = this.getDefinition( original_definitions, original_data_objects, sub_definitions, value[i], key ); 
            // logger.info("--------------sub_sub_definitions", sub_sub_definitions); 

            // SANITY CHECK
            if ( ! sub_sub_definitions ) {
              errors.push({
                depth: depth + ":" + name,
                error: "No definition found for field '" + key + "'"
              });
            }

            errors = common.validateField( this, original_definitions, original_data_objects,  sub_sub_definitions, value[i][key], current_depth, errors );
          }
        }
      }
      else if ( common.isHash( value ) ) {
        // logger.info("------------------------------ value IS A HASH"); 
        
        var sub_definitions = this.getDefinition( original_definitions, original_data_objects, definitions, value, name );
        // logger.info("-------------- sub_definitions", sub_definitions);

        for ( var key in value ) {
          // logger.info("-------------- ^^^^^^^^^^^ key: " + key + " ^^^^^^^^^^^");
          var sub_sub_definitions = this.getDefinition( original_definitions, original_data_objects, sub_definitions, value[key], key ); 
          // logger.info("--------------sub_sub_definitions", sub_sub_definitions); 

          // SANITY CHECK
          if ( ! sub_sub_definitions ) {
            errors.push({
              depth: depth + ":" + name,
              error: "No definition found for field '" + key + "'"
            });
          }

          errors = common.validateField( this, original_definitions, original_data_objects,  sub_sub_definitions, value[key], current_depth, errors );
        }
      }
      else {

        // logger.info("------------------------------ value IS NOT AN ARRAY. ( " + value + " ) DOING validateField");

        var object_name = common.getFieldFromDepth( depth );
        // logger.info("--------------object_name", object_name);
        // logger.info("--------------name", name);

        var current_depth = common.addDepth( depth, name );

        var subdefinition = this.getDefinition( original_definitions, original_data_objects, definitions, data_object, name );
        // logger.info("--------------subdefinition", subdefinition);

        if ( subdefinition == undefined ) {
          errors.push({
            depth: current_depth,
            errors: "No definition found for field '" + name + "'"
          });

          continue;
        }
        else {
          var field_definition = this.getDefinition( original_definitions, original_data_objects, subdefinition, data_object, name );
          // logger.info("--------------field_definition", field_definition );

          if ( common.isArray( field_definition ) ) {
            // logger.info("+++++++++++ DEFINITION HAS ARRAY OF CHILDREN.");
            // logger.info("+++++++++++ definition['children'] IS AN ARRAY. DOING common.matchingDefinition");
            field_definition = common.getMatchingDefinition( field_definition, data_object );
            // logger.info("+++++++++++ MATCHED field_definition", field_definition);

            if ( field_definition == null ) {
              // logger.info("sub_definition IS NULL. RETURNING NULL");
              return null;
            }
          }

          errors = common.validateField( this, original_definitions, original_data_objects, field_definition, value, depth + ":" + name, errors );          

        } // if subdefinition == undefined

      } // if common.isArray(value)

    } // for loop

    return errors;
  },

  getDefinition : function ( original_definitions, original_data_objects, definitions, data_object, field_name ) {
    // // logger.error("+++++++++++ original_data_objects", original_data_objects);
    // logger.error("+++++++++++ definitions", definitions);
    // logger.error("+++++++++++ data_object", data_object);
    // logger.error("+++++++++++ field_name", field_name);

    var sub_definition = definitions;

    // FIND DEFINITION AMONG children 
    if ( sub_definition["children"] ) {
      // logger.error("sub_definition[children]", sub_definition["children"]);

      if ( common.isArray( sub_definition["children"] ) ) {
        // logger.error("+++++++++++ DEFINITION HAS ARRAY OF CHILDREN.");
        // logger.error("+++++++++++ definition['children'] IS AN ARRAY. DOING common.matchingDefinition");
        sub_definition = common.getMatchingDefinition( sub_definition["children"], data_object );
        // logger.error("+++++++++++ MATCHED sub_definition", sub_definition);

        if ( sub_definition == null ) {
          // logger.log("sub_definition IS NULL. RETURNING NULL");
          return null;
        }
      }
    }

    // NO CHILDREN, GET DEFINITION FROM FIRST LEVEL OF PASSED DEFINITIONS
    else {
      if ( sub_definition[field_name] ) {
        sub_definition = sub_definition[field_name];
      }
    }

    if ( sub_definition["children"] ) {
      sub_definition = sub_definition["children"];
    }
    // logger.error("+++++++++++ NEW sub_definition", sub_definition);

    // RECURSIVELY SEARCH FOR FINAL datatype DEFINITION
    sub_definition = this.getBaseDefinition( original_definitions, sub_definition, data_object );


    // logger.error("+++++++++++ FINAL sub_definition", sub_definition);

    return sub_definition;
  },

  getBaseDefinition : function ( original_definitions, definition, data_object ) {
    // logger.trace("+++++++++++ definition", definition);

    if ( common.isArray( definition ) ) {
      definition = common.getMatchingDefinition( definition, data_object );
      // logger.log("definition", definition);
      if ( definition == null ) {
        // logger.log("definition NOT DEFINED. RETURNING null");
        return null;
      }
    }
    var datatype = definition["datatype"];
    // logger.trace("+++++++++++ datatype", datatype); 

    if ( original_definitions[datatype] ) {
      var current_definitions = original_definitions;
      while ( current_definitions[datatype] ) {
        current_definitions = current_definitions[datatype];
        datatype = current_definitions["datatype"];

        if ( current_definitions[datatype] == undefined 
          && original_definitions[datatype] != undefined ) {
          // logger.error("USING original definitions");
          current_definitions = original_definitions[datatype];
          datatype = current_definitions["datatype"];
        }
      }

      // logger.trace("+++++++++++ FINAL datatype", datatype);
      // logger.trace("+++++++++++ FINAL current_definitions", current_definitions);
      definition = current_definitions;
    }

    return definition;
  },

  getFieldDatatype : function ( field_definition, name ) {
    // logger.log("--------------field_definition", field_definition);
    // logger.log("--------------name", name);

    var field_datatype = "";
    if ( field_definition["datatype"] ) {
      field_datatype = field_definition["datatype"];
    }
    else {
      field_datatype = field_definition[name]["datatype"];
    }

    // logger.log("--------------field_datatype", field_datatype);
    return field_datatype;
  },

/*
  * Validates a datatype based on definitions
  *
  * Checks the following:
  *   - Required fields are present
  *   - Fields only have allowed values
  *
  * Returns the original error array passed in first call of method.
  * Otherwise, returns error array with added errors.
  *
  * @param Object definitions contains definitions for the specific data object
  * @param Object original_data_objects contains data object passed to first call of the method (i.e., no recursion yet)
  * @param String name is the field name for the data_object
  * @param Object data_object contains the subcomponent of original data vobject being passed to recursive call of the method
  * @param String depth shows the "breadcrumb-style" position of the error in the data object to be validated
  * @param Object errors contains list of error objects
  * @api public  
*/
  validateValues : function ( original_definitions, definitions, original_data_objects, name, data_object, depth, errors) {
    // // logger.debug("definitions", definitions);
    // // logger.log("--------------original_data_objects", original_data_objects);    
    // logger.debug("data_object", data_object);
    // logger.debug("depth", depth);

    errors = errors ? errors : [];
    depth = depth ? depth : "";

    try {
      // VALIDATE EACH DATA OBJECT
      if ( common.isObject(data_object) ) {
        // logger.debug("--------------data_object IS AN OBJECT");
        for ( field_name in data_object ) {
          var field_value = data_object[field_name];
          // logger.debug("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ field_name", field_name);
          // logger.debug("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ field_value", field_value);

          // var current_depth = common.addDepth(depth, field_name);
          // // logger.debug("current_depth", current_depth);

          errors = common.validateFieldValues( this, original_definitions, original_data_objects, definitions, data_object[field_name], field_name, field_value, depth, errors );

        } // for loop
      }
      else {
        // logger.debug("--------------data_object IS ** NOT ** AN OBJECT");

        var definition = this.getDefinition( original_definitions, original_data_objects, definitions, data_object, name );
        // logger.log("--------------definition", definition);

        errors = common.validateField( this, original_definitions, original_data_objects, definition, data_object, depth, errors );          
      }
    }
    catch (err) {
      // logger.debug("err", err);
    }

    return errors;
  },

};

return validator;

});
