// MAKE node-FORMAT MODULE LOOK LIKE AMD-FORMAT
var define;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function(require) {

/* External */
var JSON = require('JSON');
const fs = require('fs');
var q = require('q');
var moment = require('moment');

/* Internal */
var logger = require('./logger');
var util = require("../utils/util");
var common     = require("./common");

var validator = {

  util : util,

  definition_files : [
    __dirname + "/../../data/core.json",
    __dirname + "/../../data/datatypes.json"
  ],
  
  // specification_file : __dirname + "/../../data/datatypes.json",


  validate : function (inputs) {
    // logger.log("inputs", inputs);
    // common.validate CALLS this.recursiveValidate
    var parent = this;
    return common.validate( parent, inputs, this.definition_files );
  },

/*
  * Recursively validate a nested datatype and/or definitions
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
  * @param Object original_data_object contains data object passed to first call of the method (i.e., no recursion yet)
  * @param Object data_object contains subcomponent of original data object being passed to recursive call of the method
  * @param String depth shows the "breadcrumb-style" position of the error in the data object to be validated
  * @param Object errors contains list of error objects
  * @api public
*/
  recursiveValidate : function ( original_definitions, definitions, original_data_objects, data_object, depth, errors ) {

    // // logger.warn("arguments", arguments);
    // // logger.warn("arguments.length", arguments.length);
    // logger.warn("definitions", definitions);
    // logger.warn("data_object", data_object);
    // logger.warn("original_data_objects", original_data_objects);
    // logger.warn("depth", depth);
    // logger.warn("errors", errors);

    // IF children, VALIDATE EACH CHILD SEPARATELY
    if ( data_object.children ) {
      // logger.warn("data_object HAS CHILDREN   depth", depth);

      var children_type = typeof data_object.children;
      // // logger.warn("children_type", children_type);

      if ( children_type != "object" ) {
        errors.push({
          depth: depth,
          error: "field 'children' is not an object: " + data_object.children
        });

        return errors;
      }

      var current_depth = common.addDepth(depth, "children");

      // MAKE children AN ARRAY IF IT'S NOT ALREADY
      var children = data_object.children;
      if ( ! data_object.children.length ) {
        children = [ data_object.children ];
      }

      // RECURSIVELY VALIDATE CHILD OBJECTS
      for ( var i = 0; i < children.length; i++ ) {
        var child_data_objects = children[i];
        // logger.warn("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx child_data_objects", child_data_objects);        

        var field_depth = common.addDepth(current_depth, i);

        for ( var child_name in child_data_objects ) {
          var child_data_object = child_data_objects[child_name];
          // logger.warn("child_data_object", child_data_object);
          var child_depth = common.addDepth(field_depth,  child_name);
          // logger.warn("child_depth", child_depth);

          if ( typeof child_data_object == "string" ) {
            if ( child_name == "datatype" 
              && 
              ( original_data_objects[child_name]
                ||
                definitions[child_name]
              )
            ) {
              // SKIP VALIDATION AS THIS IS A KNOWN datatype
              // I.E., IT IS DEFINED IN THE definitions OR datatypes
              // FILE, OR BOTH
            }
            else {
              // logger.log("child_data_object IS A STRING. DOING common.validateField");
              // logger.log("definitions[" + child_name + "]", definitions[child_name]);
              errors = common.validateField( this, original_definitions, original_data_objects, definitions[child_name], child_data_object, child_depth, errors );
            }
          }
          else {
            errors = this.recursiveValidate(original_definitions, definitions, original_data_objects, child_data_object, child_depth, errors);
          }
        }
      }
    }

    // IF NO CHILDREN IN data_object, JUST VALIDATE VALUES
    else {
      // logger.warn("NO CHILDREN. DOING validateValues    depth", depth);

      errors = this.validateValues( original_definitions, definitions, original_data_objects, data_object, depth, errors );
      // logger.warn("AFTER CONCAT errors", errors);
    }

    // logger.info("Returning errors", errors);
    return errors;
  },

/*
  * Validates a datatype based on definitions
  *
  * Checks the following:
  *   - Required fields are present
  *   - Fields only have allowed values
  *
  * Possible TO DOs:
  *   - Correct number of fields is present
  *   - Field count is less than max length
  *   
  * Returns null if no errors. 
  * Otherwise, returns an error hash.
  *
  * @param String datatype_file : location of datatype file
  * @param String definition_file : location of datatype definitions file
  * @api public  
*/
  validateValues : function ( original_definitions, definitions, original_data_objects, data_object, depth, errors ) {
    // // logger.error("definitions", definitions);
    // // logger.error("original_data_objects", original_data_objects);    
    // logger.error("data_object", data_object);
    // logger.error("depth", depth);

    errors = errors ? errors : [];
    depth = depth ? depth : "";

    try {

      // RECURSE IF children PRESENT
      if ( data_object["children"] ) {
        // logger.error("data_object HAS CHILDREN.  RECURSING FOR EACH CHILD");
        for (var i = 0; i < data_object["children"].length; i++) {
          // logger.error("RECURSING CHILD    data_object['children'][" + i + "]", data_object["children"][i]);
          var current_depth = common.addDepth( depth, "children:" + i);
          errors = this.validateValues( original_definitions, definitions, original_data_objects, data_object["children"][i], current_depth, errors );
        }
      }

      // VALIDATE EACH DATA OBJECT
      else if ( common.isObject(data_object) ) {
        // logger.error( "data_object IS AN OBJECT   data_object", data_object) ;

        if ( ! common.isChild( depth ) ) {
          // logger.error("CHECKING missingRequired    depth", depth);
          errors = this.missingRequired( definitions, data_object, depth, errors );
          // ENSURE EITHER datatype OR children FIELD IS PRESENT
          errors = this.datatypeDefined( data_object, depth, errors );
        }
        else {
          // logger.error("NOT CHECKING missingRequired    depth", depth);
        }
        // logger.error("errors", errors);

        for ( field_name in data_object ) {
          var field_value = data_object[field_name];
          // logger.error("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ field_name", field_name);
          // logger.error("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ field_value", field_value);
          var current_depth = common.addDepth( depth, field_name );
          // logger.error("current_depth", current_depth);


          // VALIDATE SUCCESS IF datatype VALUE IS DEFINED IN THE
          // DATA OBJECT ITSELF.
          // NB: THIS IS A SHALLOW SEARCH - ONLY FIRST LEVEL FIELDS
          // ARE CHECKED, WHICH MEANS THAT THERE IS NO AMBIGUITY.
          //
          // { 
          //   "URL": {
          //    "desc": "...",
          //    "datatype": "REGEX",
          //    "value": "some_regex"
          //   }
          //   "NOT_CHECKED" : {
          //      "URL": { ... }
          //   },
          //   "ALSO_NOT_CHECKED" : {
          //      "URL": { .. }
          //   }   
          // }
          //
          if ( field_name == "datatype"
            && 
            ( original_data_objects[field_value]
              ||
              definitions[field_value]
            )
          ) {
            continue;
          }

          var current_definition = this.getDefinition( original_definitions, original_data_objects, definitions, data_object[field_name], field_name );
          // logger.error("current_definition", current_definition);
 
          if ( common.isHash( data_object[field_name] ) ) {
            // logger.error("CHECKING missingRequired    depth", depth);
            // logger.error("CHECKING missingRequired    data_object[" + field_name + "]", data_object[field_name]);
            errors = this.missingRequired( definitions, data_object[field_name], depth, errors );
            // ENSURE EITHER datatype OR children FIELD IS PRESENT
            errors = this.datatypeDefined( data_object[field_name], depth, errors );
          }
          else {
            // logger.error("NOT CHECKING missingRequired    depth", depth);
          }

          errors = common.validateFieldValues( this, original_definitions, original_data_objects, definitions, data_object, field_name, field_value, current_depth, errors );
        } // for loop
      } // if

      // VALIDATE WITH definition
      else {
        // logger.error("--------------------------- VALIDATING WITH definition", definitions);

        errors = common.validateField( this, original_definitions, original_data_objects, definitions, data_object, depth, errors );
      }
      // logger.error("errors", errors);

    }
    catch (err) {
      // logger.error("err", err);
    }

    return errors;
  },

  getDefinition : function ( original_definitions, original_data_objects, definitions, data_object, object_name ) {
    // logger.trace("original_data_objects", original_data_objects);
    // logger.trace("definitions", definitions);
    // logger.trace("data_object", data_object);
    // logger.trace("object_name", object_name);

    // USE OVERRIDE DEFINITION IN DATA OBJECT IF PRESENT
    if ( original_data_objects[object_name] ) {
      // logger.trace( "RETURNING original_data_objects[" + object_name + "]", original_data_objects[object_name] );
      return original_data_objects[object_name];
    }

    // OTHERWISE, CHECK DEFINITION IS PRESENT AMONG DEFINITIONS
    var definition = definitions[object_name];
    if ( ! definition ) {
      return null;
    }
    // logger.trace("definition", definition);

    // 
    if ( definition["children"] ) {
      var matching_definition = common.getMatchingDefinition( definition["children"], data_object );
      // logger.trace("matching_definition", matching_definition);

      return matching_definition;
    }
    else {
      // logger.trace("NO CHILDREN IN DEFINITION");
      var sub_definition = definition["datatype"];
      // var sub_value = definition["value"];
      while ( sub_definition != undefined && definition["datatype"] ) {
        // logger.trace("sub_definition", sub_definition);
        if ( sub_definition != undefined ) {
          if ( definitions[sub_definition] == undefined ) {
            break;
          }

          definition = definitions[sub_definition];
        }
        // logger.trace("CURRENT definition", definition);
        // logger.trace("CURRENT sub_definition", sub_definition);

        if ( definition["datatype"] == undefined ) {
          break;
        }
        sub_definition = definition["datatype"];
        // logger.trace("NEW sub_definition", sub_definition);
      }

    }   // if .. else
    
    // logger.trace("FINAL definition", definition);

    return definition;      
  },

  /**
  * Verify that 'required' fields are present.
  *
  * @param Hash definitions of datatype
  * @param Hash dataobject containing data to be verified
  * @api private
  */
  missingRequired : function (definitions, data_object, depth, errors) {
    // logger.warn("----------------------- definitions", definitions);

    for ( var field in definitions ) {
      if ( definitions[field].required 
        && definitions[field].required == 1 
        && ! data_object[field] ) {

        // logger.log("PUSHING ERROR    field", field);
        errors.push({
          depth: depth,
          error: "required field '" 
          + field 
          + "' not present"
        });
      }
    }

    return errors;
  },

  /**
  * Ensure that data object contains only one field named 'datatype' or 'children'
  *
  * @param Hash dataobject containing data to be verified
  * @api private
  */
  datatypeDefined : function ( data_object, depth, errors ) {
    // logger.log("XXXXXXXXXXXXXXXXXXXXXXXXXXX    data_object", data_object);
    // logger.log("depth", depth);
    // logger.log("errors", errors);
    // logger.log("data_object.datatype", data_object.datatype);

    var defined = [];
    if ( data_object.datatype ) {
      defined.push("datatype");
    }
    if ( data_object.children ) {
      defined.push("children");
    }
    // logger.debug("defined", defined);

    if ( defined.length == 0 ) {
      errors.push({
        depth: depth,
        error: "No 'datatype' or 'children' field defined"
      });
    }
    else if ( defined.length > 1 ) {
      errors.push({
        depth: depth,
        error: "Multiple fields defined: " + defined.join(", ")
     })
    }

    return errors;
  },

  checkValue : function (datatype, value, datatype_field_name) {
    // logger.log("datatype", datatype);
    // logger.log("value", value);
    if ( value == undefined ) {
      return "value for '" + datatype_field_name + "' not defined";      
    }

    return null;
  },

  getSubdefinitions : function (definitions, depth) {
    //// logger.log("depth", depth);
    if ( ! depth ) {
      return definitions;
    }
    var dimensions = depth.split(":");
    // //// logger.log("dimensions", dimensions);
    var subdefinitions = definitions;
    for ( var i = 0; i < dimensions.length; i++) {
      // //// logger.log("dimensions[" + i + "]", dimensions[i]);
      subdefinitions = subdefinitions[dimensions[i]];
      // //// logger.log("subdefinitions", subdefinitions);
    }

    return subdefinitions;
  }

};

return validator;

});

