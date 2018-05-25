// MAKE node-FORMAT MODULE LOOK LIKE AMD-FORMAT
var define;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function(require) {

/* External */
var JSON       = require('JSON');
const fs       = require('fs');
var jsep       = require('jsep');
var sync       = require('synchronize')

/* Internal */
var logger     = require('./logger');
var common     = require("./common");
var remote     = require("../utils/remote");

var validator = {

  remote: remote,

  validate : function ( definition, value, depth, errors ) {
    // logger.log("definition", definition);
    // logger.log("value", value);
    // logger.log("depth", depth);
    // logger.log("errors", errors);

    var limits = definition["_limit"];
    for ( var limit in limits ) {
      if ( limit == "desc" ) {
        continue;
      }
      else if ( limit == "choice" ) {
        return this.limitChoice( limits[limit], value, depth, errors );
      }
      else if ( limit == "choice+") {
        return errors;
      }
      else if ( limit == "range" ) {
        return this.limitRange( limits[limit], value, depth, errors );
      }
      else if ( limit == "type" ) {
        return this.limitType( limits[limit], value, depth, errors );
      }
      else if ( limit == "regex" ) {
        return this.limitRegex( limits[limit], value, depth, errors );
      }
      else if ( limit == "eval" ) {
        return this.limitEval( limits[limit], value, depth, errors );
      }
      else (
        errors.push({
          depth: depth,
          error: "Limit not supported: " + limit
        })
      )
    }

    return errors;
  },

  limitRange : function ( limit, value, depth, errors ) {
    // logger.log("****************** limit", limit);
    // logger.log("value", value);

    var min = limit["min"];
    var max = limit["max"];
    var exclusive = limit["exclusive"];
    // logger.log("min", min);
    // logger.log("max", max);

    if ( exclusive == true ) {
      if ( value <= min || value >= max ) {
        errors.push({
          depth: depth,
          error: "Value '" + value + "' is not in range: " + min + "-" + max
        })
      }
    }
    else {
      if ( ! (value >= min && value <= max) ) {
        errors.push({
          depth: depth,
          error: "Value '" + value + "' is not in range: " + min + "-" + max
        })
      }
    }

    return errors;
  },

  limitChoice : function ( limit, value, depth, errors ) {
    // logger.log("****************** limit", limit);
    // logger.log("value", value);

    var found = false;
    for (var i = 0; i < limit.length; i++) {
      var option = limit[i];
      // logger.log("option", option);
      if ( common.isHash( option ) ) {
        option = option["value"];
      }
      // logger.log("FINAL option", option);
      // logger.log("value", value);

      if ( value == option ) {
        found = true;
      }
    }

    if ( found == false ) {
      errors.push({
        depth: depth,
        error: "Value not found among choice options: " + value 
      })
    }

    return errors;
  },

  limitType : function ( limit, value, depth, errors ) {
    logger.log("oooooooooooooooooooo limit", limit);
    logger.log("value", value);

    var thisObj = this;

    return common._asyncFunction( 'limitType', function( deferred ) {

      var type = limit.type;

      if ( typeof value != "object" ) {
        var values = type.split(",");
        // logger.log("values", values);

        var found = false;
        for (var i = 0; i < values.length; i++) {
          var subtype = values[i];
          var regex_value = subtype;
          if ( subtype.match( /^\^.+\$\+$/ ) ) {
            regex_value = type.replace( /\$\+/, "") + "\.+$";
          }
          // logger.log("regex_value", regex_value);

          var regex = new RegExp( regex_value , "" );
          var match = value.toString().match(regex);
          if ( match != null ) {
            found = true;
          }
        }
        // logger.log("found", found);

        // PLACEHOLDER: HANDLE eval LATER
        if ( value.match(/^eval:/) ) {
          found = true;
        }

        if ( found == false ) {
          errors.push({
            depth: depth,
            error: "Value '" + value + "' does not match type: " + type
          })
        }
      }
      else {
        var keys = value.keys;
        // logger.log("thisObj.remote", thisObj.remote);
        logger.log("value", value);

        var id;
        for ( var key in value ) {
          id = value[key];
        }
        logger.log("id", id);
        logger.log("type", type);

        thisObj.remote.fetch("objList", id)
        .then( function ( data ) {
          // logger.log("data", data);

          if ( data == undefined ) {
            errors.push({
              depth: depth,
              error: "Value '" + value + "' does not match type: " + type
            })
          }
          else {        
            var found = false;
            for (var i = 0; i < data.length; i++) {
              var subtype = data[i]._type;
              logger.log("subtype", subtype);
              logger.log("typeof subtype", typeof subtype);
              var regex_value = type;
              logger.log("regex_value", regex_value);
              if ( type.match( /^\^.+\$\+$/ ) ) {
                regex_value = type.replace( /\$\+/, "") + "\.+$";
              }
              logger.log("FINAL regex_value", regex_value);

              var regex = new RegExp( regex_value , "" );
              var match = subtype.match(regex);
              if ( match != null ) {
                found = true;
              }
            } // for loop

            logger.log("found", found);

            if ( found == false ) {
              errors.push({
                depth: depth,
                error: "Value '" + value + "' does not match type: " + type
              })

              logger.log("RETURNING errors", errors);
            }

            deferred.resolve( errors );

          } // if .. else

        }); // then

      } // if .. else

      logger.log("RETURNING deferred promise", deferred.promise)
      return deferred.promise;

    }); // _asyncFunction

  },

  limitRegex : function ( limit, value, depth, errors ) {
    // logger.log("oooooooooooooooooooo limit", limit);
    // logger.log("value", value);
    // logger.log("depth", depth);

    var regex_value = limit;
    // logger.log("regex_value", regex_value);

    var regex = new RegExp( regex_value , "" );
    var match = value.toString().match(regex);
    if ( match == null ) {
      // logger.log("depth", depth);
      errors.push({
        depth: depth,
        error: "Value '" + value + "' does not match regex: " + regex_value
      })
    }

    return errors;
  },

  limitEval : function ( limit, value, depth, errors ) {
    // logger.log("oooooooooooooooooooo limit", limit);
    // logger.log("value", value);
    // logger.log("depth", depth);

    if ( value === undefined 
      || value === null ) {

      errors.push({
        depth: depth,
        error: "Value is null or undefined: " + value
      });
    }
    else {    
      var eval_string = limit.replace(/\$val/g, value);
      // logger.error("eval_string", eval_string);
      var expression = jsep(eval_string);

      try {
        var result = this.evaluateExpression( expression );
        if ( result == false ) {
          errors.push({
            depth: depth,
            error: "Value '" + value + "' returned FALSE on eval: " + limit
          })            
        }      
      }
      catch ( error ) {
        // logger.log("error", error);
      }
    }

    return errors;
  },

  evaluateExpression : function ( expression ) {
    // logger.log("expression", expression);

    if ( expression.type === "LogicalExpression" ) {
      // logger.log("DOING LogicalExpression");
      if ( expression.operator == "||" ) {
        // logger.log("operator is OR: ", expression.operator);
        return ( this.evaluateExpression( expression.left )
          || this.evaluateExpression( expression.right )
        );
      } 
      else if ( expression.operator === "&&" ) {
        // logger.log("operator is AND: ", expression.operator);
        return ( this.evaluateExpression( expression.left )
          && this.evaluateExpression( expression.right )
        );
      }
      else {
        // logger.log("LOGICAL EXPRESSION OPERATOR NOT SUPPORTED", expression.operator);
      }
    }
    else if ( expression.type == "BinaryExpression"
      || expression.type === "Identifier" ) {
      // logger.log("DOING BinaryExpression/Identifier");
      var value1 = this.evaluateExpression( expression.left );
      var value2 = this.evaluateExpression( expression.right );

      if (expression.operator === "|") {
        return value1 | value2;
      } 
      else if (expression.operator === "^") {
        return value1 ^ value2;
      } 
      else if (expression.operator === "&") {
        return value1 & value2;
      } 
      else if (expression.operator === "==") {
        return value1 == value2;
      } 
      else if (expression.operator === "!=") {
        return value1 != value2;
      } 
      else if (expression.operator === "===") {
        return value1 === value2;
      } 
      else if (expression.operator === "!==") {
        return value1 !== value2;
      } 
      else if (expression.operator === "<") {
        return value1 < value2;
      } 
      else if (expression.operator === ">") {
        return value1 > value2;
      } 
      else if (expression.operator === "<=") {
        return value1 <= value2;
      } 
      else if (expression.operator === ">=") {
        return value1 >= value2;
      } 
      else if (expression.operator === "<<") {
        return value1 << value2;
      } 
      else if (expression.operator === ">>") {
        return value1 >> value2;
      } 
      else if (expression.operator === ">>>") {
        return value1 >>> value2;
      } 
      else if (expression.operator === "+") {
        return value1 + value2;
      } 
      else if (expression.operator === "-") {
        return value1 - value2;
      } 
      else if (expression.operator === "*") {
        return value1 * value2;
      } 
      else if (expression.operator === "/") {
        return value1 / value2;
      } 
      else if (expression.operator === "%") {
        return value1 % value2;
      }      
    }
    else if (expression.type === "UnaryExpression") {
      // logger.log("DOING UnaryExpression");
      var val = this.evaluateExpression( expression.argument );

      if (expression.operator === "-") {
        return -val;
      } 
      else if (expression.operator === '!') {
        return !val;
      } 
      else if (expression.operator === '~') {
        return ~val;
      } 
      else if (expression.operator === '+') {
        return +val;
      }
    }
    else if ( expression.type === "Literal" ) {
      // logger.log("DOING LiteralExpression");
      return expression.value;
    }
    else {
      // logger.error("expression.type not supported", expression.type);
      return null;
    }  
  },

  // verify fields present if required
  checkRequired : function ( definitions, data_object, depth, errors ) {
    // // logger.info("definitions", definitions);
    // // logger.info("data_object", data_object);

    for ( var attribute in definitions ) {
      // logger.log("definitions[" + attribute + "]", definitions[attribute]);
      // logger.log("data_object[" + attribute + "]", data_object[attribute]);
      if ( 
        definitions[attribute]["_vital"] 
        && definitions[attribute]["_vital"] == true 
        && data_object[attribute] == undefined ) {

        // logger.log(" *********************** PUSHING TO errors");

        errors.push({
          depth: depth,
          error: "Required field not found: " + attribute
        })

      }
    }

    // logger.log("RETURNING errors", errors);

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
  },

  // verify top level fields:
  //   - present if required
  //   - have valid type
  checkTopLevel : function ( core, data_object, depth, errors ) {
    // logger.log("core", core);
    // logger.log("data_object", data_object);

    errors = this.checkRequired( core, data_object, depth, errors );

    errors = this.checkFields( core, data_object, depth, errors );    
    // logger.error("errors", errors);

    return errors;
  }

}


return validator;

});

