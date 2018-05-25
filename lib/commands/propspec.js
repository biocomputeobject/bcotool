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
var util       = require("../utils/util");
var common     = require("./common");
var primitives = require("./primitives");

var validator = {

  util : util,

  core_file :        __dirname + "/../../data/hive/core.json",
  attributes_file:   __dirname + "/../../data/hive/attributes.json",
  
  /*
  * Validates a datatypes file using a HIVE core.json file.
  * Returns null if no errors. 
  * Otherwise, returns an error hash.
  *
  * @param String data_file containing data to be validated
  * @param String definitions_file containing datatype definitions
  * @api public
  */
  validate : function ( inputs ) {
    // logger.log("inputs", inputs);

    var data_file         =   inputs["data_file"];
    var core_file         =   inputs["core_file"] || this.core_file;
    var attributes_file   =   inputs["attributes_file"] || this.attributes_file;
    var output_file       =   inputs["output_file"];
    // logger.log("data_file", data_file);  
  
    var deferred = q.defer();
    var thisObj = this;

    setTimeout( function () {

      try {

        // CHECK FILES EXIST
        if ( ! fs.existsSync(data_file) ) {
          // logger.log("data_file DOES NOT EXIST: %s", data_file);
          return deferred.resolve("Can't find data file: " + data_file);
        }

        // logger.log("LOADING DATA FILE", data_file);
        var data_object = util.jsonFileToData(data_file);
        // // logger.log("data_object", data_object);

        // logger.log("LOADING CORE FILE", core_file);
        var core = util.jsonFileToData( core_file );
        if ( core == null ) {
          console.log("Can't load core file", core_file);
          process.exit(1);
        }
        // // logger.log("core", core);

        var attributes = util.jsonFileToData( attributes_file );
        if ( attributes == null ) {
          console.log("Can't load attributes file", attributes_file);
          process.exit(1);
        }
        // // logger.log("attributes", attributes);

        // SET VARIABLES
        var depth = "";
        var errors = [];

        // VALIDATE TOP LEVEL FIELDS
        // logger.log("DOING checkTopLevel");
        errors = thisObj.checkTopLevel( core, data_object, depth, errors );
        // logger.log("errors", errors); 

        // VALIDATE ATTRIBUTES
        // logger.log("DOING validateAttributes");
        errors = thisObj.validateAttributes( attributes, data_object["_attributes"], depth, errors );
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

  // verify fields for each attribute:
  //   - present if required
  //   - have valid type
  validateAttributes : function ( attributes, data_object, depth, errors ) {
    // // logger.trace("attributes", attributes);
    // logger.trace("data_object", data_object);
    // logger.trace("depth", depth);
    // logger.trace("errors", errors);

    for ( var field_name in data_object ) {
      // logger.trace("field_name", field_name);
      // logger.trace("data_object[" + field_name + "]", data_object[field_name]);

      var current_depth = common.addDepth(depth, field_name);
      // logger.trace("current_depth", current_depth);

      var value = data_object[field_name];
      // logger.trace("value", value);
      // logger.trace("typeof value", typeof value);

      if ( typeof value == "object" 
          && field_name != "_children" ) {

        // logger.trace("VALIDATING OBJECT");
        errors = this.checkRequired( attributes, data_object[field_name], current_depth, errors );

        errors = this.checkFields( attributes, data_object[field_name], current_depth, errors );
      }
      else if ( depth != "" ) {
        // logger.trace("VALIDATING STRING");
        // logger.log("field_name", field_name);
        // logger.log("attributes", attributes);
        errors = this.validateField( attributes[field_name], data_object[field_name], field_name, current_depth, errors );
      }
    }
    // logger.trace("errors", errors);

    return errors;
  },

  checkFields : function ( definitions, data_object, depth, errors ) {
    // logger.log("definitions", definitions);
    // logger.error("data_object", data_object);
    // logger.error("depth", depth);
    // logger.error("errors", errors);

    for ( var field_name in data_object ) {
      // logger.error("field_name", field_name);

      var value = data_object[field_name];
      var definition = definitions[field_name];
      // logger.error("value", value);
      // logger.error("definition", definition);

      if ( definition == undefined ) {
        errors.push({
          depth: depth,
          error: "No definition found for field: " + field_name
        })

        continue;
      }

      errors = this.validateField( definition, value, field_name, depth, errors );

      if ( field_name == "_children" ) {
        var children = data_object[field_name];
        // logger.error("RECURSING ON CHILDREN field_name = ", field_name);

        for ( var sub_field in children ) {
          var current_depth = common.addDepth( depth, sub_field );
          // logger.error("current_depth", current_depth);

          // logger.trace("VALIDATING OBJECT");
          errors = this.checkRequired( definitions, children[sub_field], current_depth, errors );

          errors = this.checkFields( definitions, children[sub_field], current_depth, errors );

          errors = this.validateAttributes( definitions, children[sub_field], current_depth, errors );

        }
      }
    }

    return errors;
  },

  // validate the value of a field based on its defined datatype
  validateField : function ( definition, value, name, depth, errors ) {
    // logger.log("definition", definition);
    // logger.log("value", value);
    // logger.log("name", name);
    // logger.log("depth", depth);
    // logger.log("errors", errors);

    if ( ! definition["datatype"] ) {
      errors.push({
        depth: depth,
        error: "No datatype field in definition for field: " + name
      })

      return errors;
    }
    // logger.log("definition", definition);

    var subroutine = common.getSubroutine( definition, name );
    // logger.log("subroutine", subroutine);
    if ( subroutine == null ) {
      errors.push({
        depth: depth,
        error: "No datatype in description for field: " + name 
      })

      return errors;
    }

    if ( primitives[subroutine] == undefined ) {
      errors.push({
        depth: depth,
        error: "Subroutine not found: " + subroutine 
      });
    }

    var validated = primitives[subroutine]( definition, value );
    // logger.info("validated", validated);
    if ( validated == false ) { 
      errors.push({
        depth: depth,
        error: "Field '" + name + "' value '" + value
          + "' does not match datatype '"
          + definition["datatype"] + "'"
      });
    }

    return errors;
  },

  // verify fields present if required
  checkRequired : function ( definitions, data_object, depth, errors ) {
    // // logger.log("definitions", definitions);
    // logger.log("data_object", data_object);

    for ( var attribute in definitions ) {
      if ( 
        ( 
          definitions[attribute]["is_optional"] == undefined
          ||  
          ( definitions[attribute]["is_optional"]
            && definitions[attribute]["is_optional"] == false 
          )
        )
        && data_object[attribute] == undefined ) {

        errors.push({
          depth: depth,
          error: "Required value not found: " + attribute
        })
      }
    }

    return errors;
  },

  // verify top level fields:
  //   - present if required
  //   - have valid type
  checkTopLevel : function ( core, data_object, depth, errors ) {
    // // logger.log("core", core);
    // logger.log("data_object", data_object);

    errors = this.checkRequired( core, data_object, depth, errors );

    errors = this.checkFields( core, data_object, depth, errors );    
    // logger.error("errors", errors);

    return errors;
  },

  getSubroutine : function ( definition, name ) {
    // logger.log("definition", definition);
    // logger.log("name", name);

    var datatype = definition["datatype"];
    if ( datatype == undefined ) {
      return null;
    }

    return "validate" + datatype.toUpperCase();
  }

}


return validator;

});

