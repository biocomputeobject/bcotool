// MAKE node-FORMAT MODULE LOOK LIKE AMD-FORMAT
var define;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function(require) {

/* External */
var JSON       = require('JSON');
const fs       = require('fs');
var q          = require('q');
var moment     = require('moment');
var jsep       = require('jsep');

/* Internal */
var logger     = require('./logger');
var util       = require("../utils/util");
var common     = require("./common");
var primitives = require("./primitives");
var limit      = require("./limit");

var validator = {

  util : util,

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
    logger.log("inputs", inputs);

    var data_file         =   inputs["data_file"];
    var propspec_file     =   inputs["propspec_file"];
    var output_file       =   inputs["output_file"];
    logger.log("data_file", data_file);  
  
    var deferred = q.defer();
    var thisObj = this;

    setTimeout( function () {

      try {

        // CHECK FILES EXIST
        if ( ! fs.existsSync(data_file) ) {
          return deferred.resolve("Can't find data file: " + data_file);
        }

        logger.log("LOADING DATA FILE", data_file);
        var data_object = util.jsonFileToData(data_file);
        // logger.log("data_object", data_object);

        logger.log("LOADING PROPSPEC FILE", propspec_file);
        var propspec = util.jsonFileToData( propspec_file );
        if ( propspec == null ) {
          return deferred.resolve("Can't load propspec file: " +propspec_file);
        }
        
        // GET DEFINITIONS
        var definitions = propspec["_field"];
        if ( definitions == null ) {
            return deferred.resolve("Can't find '_definitions' or '_field' field in propspec file: " + propspec_file);
        }

        // SET VARIABLES
        var depth = "";
        var errors = [];

        // VALIDATE ATTRIBUTES
        logger.log("DOING validateAttributes");
        errors = thisObj.validateAttributes( definitions, data_object, depth, errors );
        logger.log("errors", errors); 

        return deferred.resolve({
          errors: errors
        });
      }
      catch (err) {
        logger.log("err.message", err.message);
        if (err.stack) {
          logger.error(err.stack);
        }
        else {
          //logger.error("err " + "[" + err.lineNumber + "]", err);
           return deferred.resolve(result.stderr);
        }
      }
    },
    50);

    logger.log("Returning deferred promise", deferred.promise)
    return deferred.promise;
  },

  // verify fields for each attribute:
  //   - present if required
  //   - have valid type
  validateAttributes : function ( definitions, data_object, depth, errors ) {
    // logger.trace("definitions", definitions);
    logger.trace("data_object", data_object);
    logger.trace("depth", depth);
    logger.trace("errors", errors);

    // ADD _id
    definitions["_id"] = { 
      _type: "hiveid",
      _vital: true 
    };

    data_object = this.getDefaults( definitions, data_object );
    logger.log("data_object", data_object);

    errors = this.checkRequired( definitions, data_object, depth, errors );

    for ( var field_name in data_object ) {
      logger.trace(">>>>>>>>>  field_name: " + field_name + "  <<<<<<<<<");
      logger.trace("definitions[field_name]", definitions[field_name]);
      var definition = this.getDefinition(definitions, field_name);
      logger.trace("definition", definition);

      if ( definition == undefined ) {
        errors.push({
          depth: depth,
          error: "No definition found for field: " + field_name
        })

        continue;
      }

      var value = data_object[field_name];
      logger.trace("value", value);

      if ( typeof value == "object"
        && definition["_field"] != undefined ) {
        value = this.getDefaults( definition["_field"], value );
      }      

      var current_depth = common.addDepth(depth, field_name);
      logger.trace("current_depth", current_depth);

      // FIELD is_plural == true
      var is_plural = definition["_plural"];
      logger.error("is_plural", is_plural);
      if ( is_plural && is_plural == true ) {
        errors = this.handlePlural( definition, value, field_name, current_depth, errors );
      }
      else {
        var datatype = definition["_type"];
        logger.log("datatype", datatype);

        if ( typeof value == "object" 
          && datatype != "array"
          && datatype != "list" ) {

          logger.trace("************* ***************** *************");
          logger.trace("************* VALIDATING OBJECT *************");

          if ( ! common.isArray( data_object[field_name] ) ) {
            errors = this.checkRequired( definition["_field"], data_object[field_name], current_depth, errors );        
          }

          errors = this.checkFields( definition["_field"], data_object[field_name], current_depth, errors );
          logger.log("errors", errors);

        }
        else {
        // else if ( depth != "" ) {
          logger.trace("************* ***************** ************* ");
          logger.trace("************* VALIDATING STRING ************* ");

          logger.trace("field_name", field_name);
          // logger.trace("definitions", definitions);
          errors = this.validateField( definition, data_object[field_name], field_name, depth, errors );
        }
      }
    }
    logger.trace("errors", errors);

    return errors;
  },

  handlePlural : function ( definition, value, field_name, depth, errors ) {
      var datatype = definition["_type"];
      logger.log("datatype", datatype);

    // FIELD VALUE IS AN ARRAY
    if ( common.isArray( value ) ) {
      logger.trace("DATA OBJECT IS AN ARRAY");
      for ( var i = 0; i < value.length; i++) {
        errors = this.validateField( definition, value[i], field_name, depth, errors );
      };
    }
    // FIELD VALUE IS A HASH
    else if ( common.isHash ( value ) ) {
      logger.trace("DATA OBJECT IS A HASH");

      // FIELD HAS CHILDREN
      if ( definition["_field"] ) {
        logger.trace("CHILDREN INSIDE MULTI    definition['_field']", definition["_field"]);

        // HANDLE array DATATYPE
        if ( datatype == "array" ) {
          for ( var subfield_name in value ) {
            logger.trace("subfield_name", subfield_name);
            var current_subdepth = common.addDepth( depth, subfield_name );
            for ( var sub_subfield_name in value[subfield_name] ) {
              logger.trace("sub_subfield_name", sub_subfield_name);

              for ( var third_subfield_name in value[subfield_name][sub_subfield_name] ) {
                logger.trace("third_subfield_name", third_subfield_name);
                logger.trace("DOING this.validateField");
                errors = this.validateField( definition["_field"][third_subfield_name], value[subfield_name][sub_subfield_name][third_subfield_name], third_subfield_name, current_subdepth, errors );
              }                  
            }
          }
        }
        // HANDLE NON-array DATATYPE
        else {
          errors = this.checkFields( definition["_field"], value, depth, errors );
        }
      }
      // FIELD HAS NO CHILDREN
      else {
        for ( var key in value ) {
          logger.error("DOING this.validateField.    value", value);
          errors = this.validateField( definition, value[key], field_name, depth, errors );
        }            
      }
    }
    // ERROR IF FIELD VALUE IS NEITHER AN ARRAY NOR A HASH
    else {
      errors.push({
        depth: depth,
        error: "Field '" + field_name + "' is plural but value is scalar: " + value
      });
    }

    return errors;
  },

  getDefinition : function ( definitions, field_name ) {
    // logger.error("+++++++++++ definitions", definitions);
    logger.error("+++++++++++ field_name", field_name);

    var definition = null;

    if ( definitions["_field"] ) {
      definition = definitions["_field"][field_name];
    }
    else {
      definition = definitions[field_name];
    }

    logger.error("RETURNING definition", definition);
    return definition;
  },

  // recursively validate fields in the data_object and its children
  checkFields : function ( definitions, data_object, depth, errors ) {
    // logger.error("definitions", definitions);
    // logger.error("data_object", data_object);
    logger.error("depth", depth);
    logger.error("errors", errors);

    for ( var field_name in data_object ) {
      logger.error("field_name", field_name);

      var value = data_object[field_name];
      logger.error("value", value);

      if ( definitions[field_name] && definitions[field_name]["_field"] ) {
        var children = data_object[field_name];
        logger.error("RECURSING ON CHILDREN.    children: ", children);

        var current_depth = common.addDepth(depth, field_name);
        errors = this.checkFields( definitions[field_name]["_field"], children, current_depth, errors );
      }
      else {
        var definition = definitions[field_name];
        logger.error("definition", definition);
        if ( definition == undefined ) {
          errors.push({
            depth: depth,
            error: "No definition found for field: " + field_name
          })

          continue;
        }

        var is_plural = definition["_plural"];
        logger.error("is_plural", is_plural);

        var current_depth = common.addDepth( depth, field_name );
        logger.error("current_depth", current_depth);

        if ( is_plural ) {
          if ( common.isArray( value) ) {
            logger.trace("DATA OBJECT IS AN ARRAY");
            for ( var i = 0; i < value.length; i++) {
              logger.error("Validating value[" + i + "]", value[i]);
              errors = this.validateField( definition, value[i], field_name, current_depth, errors );
            };
          }
          else if ( common.isHash ( value ) ) {
            logger.log("DOING validateField ON value", value);
            errors = this.validateField( definition, value, field_name, depth, errors );
          }
          else {
            errors.push({
              depth: current_depth,
              error: "Field '" + field_name + "' is multi but value is scalar: " + value
            });

            continue;
          }
        }
        else {
          errors = this.validateField( definition, value, field_name, current_depth, errors );
        }
      }
    }

    return errors;
  },

  // validate the value of a field based on its defined datatype
  validateField : function ( definition, value, name, depth, errors ) {
    logger.log("definition", definition);
    logger.log("value", value);
    logger.log("name", name);
    logger.log("depth", depth);
    logger.log("errors", errors);

    if ( ! definition["_type"] && ! definition["_field"] ) {
      errors.push({
        depth: depth,
        error: "No '_type' or '_field' fields in definition for field: " + name
      })

      return errors;
    }
    logger.log("definition", definition);

    var subroutine = this.getSubroutine( definition );
    logger.log("subroutine", subroutine);
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
    logger.info("validated", validated);
    if ( validated == false ) { 
      errors.push({
        depth: depth,
        error: "Field '" + name + "' value '" + JSON.stringify(value)
          + "' does not match datatype '"
          + definition["_type"] + "'"
      });
    }
    else if ( definition["_limit"] ) {
      errors = limit.validate( definition, value, depth, errors );
    }

    return errors;
  },

  // add default value if field is absent
  getDefaults : function ( definitions, data_object ) {
    // logger.info("definitions", definitions);
    // logger.info("data_object", data_object);

    for ( var attribute in definitions ) {
      // logger.log("attribute", attribute);
      // logger.info("definitions[" + attribute + "]", definitions[attribute]);
      // logger.info("data_object[" + attribute + "]", data_object[attribute]);

      // ADD SCALAR DEFAULT VALUE (ASSUMES FIELD WITH
      // default VALUE IS _vital)
      if ( 
        definitions[attribute]["_default"] != undefined 
        && data_object[attribute] == undefined ) {

        // logger.log("ADDING DEFAULT FOR FIELD '" + attribute + "':", definitions[attribute]["_default"]);

        data_object[attribute] = definitions[attribute]["_default"];
      }
      // ADD DEFAULT VALUES TO SUBFIELDS OF _vital FIELD
      else if ( definitions[attribute]["_vital"] == true ) {
        var sub_fields = definitions[attribute]["_field"];
        if ( sub_fields != undefined ) {
          for ( var sub_field in sub_fields ) {
            if ( sub_fields[sub_field]["_default"] != undefined ) {
              if ( data_object[attribute] == undefined ) {
                data_object[attribute] = {};
              }

              data_object[attribute][sub_field] = sub_fields[sub_field]["_default"];
            }
          }          
        } 
      }
    }
    // logger.log("RETURNING data_object", data_object);

    return data_object;
  },

  // verify fields present if required
  checkRequired : function ( definitions, data_object, depth, errors ) {
    logger.info("definitions", definitions);
    logger.info("data_object", data_object);

    for ( var attribute in definitions ) {
      logger.info("definitions[" + attribute + "]", definitions[attribute]);
      logger.info("data_object[" + attribute + "]", data_object[attribute]);
      if ( 
        definitions[attribute]["_vital"] 
        && definitions[attribute]["_vital"] == true 
        && data_object[attribute] == undefined ) {

        logger.info(" *********************** PUSHING TO errors");

        if ( definitions[attribute]["default"] ) {
          data_object[attribute] = definitions[attribute]["default"];
        }
        else {
          errors.push({
            depth: depth,
            error: "Required field not found: " + attribute
          })
        }
      }
    }

    logger.log("RETURNING errors", errors);

    return errors;
  },

  getSubroutine : function ( definition ) {
    // logger.warn("definition", definition);

    var datatype = definition["_type"];
    if ( datatype == undefined ) {
      return null;
    }

    // FIX HIVE TYPES
    if ( datatype == "array" ) {
      datatype = "hivearray";
    }
    else if ( datatype == "regex" ) {
      datatype = "hiveregex";
    }

    var subroutine = "validate" + datatype.toUpperCase();

    return subroutine;
  }

}


return validator;

});

