define([
  'intern!bdd',
  'intern/chai!should',
  'intern/chai!expect',
  'intern/dojo/node!tracer/lib/index.js',
  'intern/dojo/node!../../../../../../../lib/commands/limit',
  'intern/dojo/node!../../../../../../../lib/utils/util',
  "intern/dojo/node!JSON",
  "intern/dojo/node!q", 
  "intern/dojo/node!fs",
  "intern/dojo/node!asyncawait/async", 
  "intern/dojo/node!../../../../../../../tests/support/lib/util" 
], function (

bdd, 
should,
expect,
Tracer,
validator,
commonUtil,
JSON,
q,
fs,
async,
util

) {
should();
with (bdd) {

 var logger = new Tracer.console();

 describe("validate", function () {

  it("should validate constraints on primitive values", function () {

    var testname = "validate";
    var tests = [

      // "choice" - choice of values; the specification is an array of individual values and/or JSON objects with keys "value" and "title" with the obvious meaning; e.g. "choice": [ 2, 4, { "value": 8, "title": "8 (recommended)"} ] means values can be 2, 4, or 8, which will be displayed to the user as "2", "4", or "8 (recommended)" respectively

      {
        name: "choice",
        "definition": {
          "_type": "string",
          "_default": "old",
          "_limit": {
            "choice": [ 
              {  
                "value": "old", 
                "title": "Old format" 
              }, 
              { 
                "value": "new", 
                "title": "New format (experimental)" 
              } 
            ]
          }
        },
        "value": "old",
        "expected": []
      },

      // "choice+" - no constraint (UI allows user to select from a set of choices - presented from a constraint specification in the same format same as for "search" - or enter a custom value)

      {
        name: "choice+",
        "definition": {
          "_type": "string",
          "_default": "old",
          "_limit": {
            "choice+": [ 
              {  
                "value": "old", 
                "title": "Old format" 
              }, 
              { 
                "value": "new", 
                "title": "New format (experimental)" 
              } 
            ]
          }
        },
        "value": "ANY_VALUE",
        "expected": []
      },

      // "range" - numeric range, specified by an object with "min" / "max" / "exclusive" keys (each of the keys is optional); e.g { "min": 0, "exclusive": true } means value must be greater than 0

      {
        name: "range",
        "definition": {
          "_type": "int",
          "_limit": {
            "range": {
              "min": 1, 
              "max": 20
            },
            "desc": "Enter a valid nmer length"
          }
        },
        "value": 10,
        "expected": []
      },

      {
        name: "range",
        "definition": {
          "_type": "int",
          "_limit": {
            "range": {
              "min": 1, 
              "max": 20,
              "exclusive": true
            },
            "desc": "Enter a valid nmer length"
          }
        },
        "value": 20,
        "expected": [{
          depth: "",
          error: "Value '20' is not in range: 1-20"
        }]  
      },


      // "type" - any object matching specified types; the constraint specification is a string containing a comma-separated list of regexps matching type names, each one optionally prefixed with ! to negate and/or suffixed with + indicating the type(s) matching the regexp or any of its (their) descendents; e.g. "^genome$+,folder" to match objects of type genome , or of any type descending from genome , or any type with folder as a substring in the name.

      {
        name: "type",
        definition: {
          _type: "hiveid",
          _limit: {
            "type": "^genome$"
          }
        },
        value: "genome",
        expected: []
      },

      {
        name: "type",
        definition: {
          _type: "hiveid",
          _limit: {
            "type": "^genome$"
          }
        },
        value: "genomeX",
        expected: [{
          depth: "",
          error: "Value 'genomeX' does not match type: ^genome$"
        }]
      },

      {
        name: "type",
        definition: {
          _type: "hiveid",
          _limit: {
            "type": "^genome$+"
          }
        },
        value: "genomeX",
        expected: []
      },

      {
        name: "type",
        definition: {
          _type: "hiveid",
          _limit: {
            "type": "^genome$+"
          }
        },
        value: "Xgenome",
        expected: [{
          depth: "",
          error: "Value 'Xgenome' does not match type: ^genome$+"
        }]
      },

      {
        name: "type",
        definition: {
          _type: "hiveid",
          _limit: {
            "type": "^genome$+,folder"
          }
        },
        value: "folder",
        expected: []
      },

      {
        name: "type",
        definition: {
          _type: "hiveid",
          _limit: {
            "type": "^genome$+,folder"
          }
        },
        value: "Xgenome",
        expected: [{
          depth: "",
          error: "Value 'Xgenome' does not match type: ^genome$+,folder"
        }]
      },

      // "regexp" - regular expression match; the specification is a UTF-8 string containing a valid regular expression.

      {
        name: "regex",
        definition :   { 
          _type: "regex",
          _limit: {
            "regex": "^[0-9]$"
          } 
        },
        value : 1,
        expected : []
      },
      {
        name: "regex",
        definition :   { 
          _type: "regex",
          _limit: {
            "regex": "^[0-9]$"
          } 
        },
        value : "abc",
        expected : [{
          depth: "",
          error: "Value 'abc' does not match regex: ^[0-9]$"
        }]
      },
      {
        name: "regex",
        definition :   { 
          _type: "regex",
          _limit: {
            "regex": "^(\\d+|[a-z_][a-z0-9_]{0,7}\.\\d+|http.*:\\S+)$"
          } 
        },
        value : "12345678",
        expected : []
      },
      {
        name: "regex",
        definition :   { 
          _type: "regex",
          _limit: {
            "regex": "^(\\d+|[a-z_][a-z0-9_]{0,7}\.\\d+|http.*:\\S+)$"
          } 
        },
        value : "obj.12345",
        expected : []
      },
      {
        name: "regex",
        definition :   { 
          _type: "regex",
          _limit: {
            "regex": "^(\\d+|[a-z_][a-z0-9_]{0,7}\.\\d+|http.*:\\S+)$"
          } 
        },
        value : "12345.obj",
        expected : [{
          depth: "",
          error: "Value '12345.obj' does not match regex: ^(\\d+|[a-z_][a-z0-9_]{0,7}.\\d+|http.*:\\S+)$"
        }]
      },
      {
        name: "regex",
        definition :   { 
          _type: "regex",
          _limit: {
            "regex": "^(\\d+|[a-z_][a-z0-9_]{0,7}\.\\d+|http.*:\\S+)$"
          } 
        },
        value : "http://site.com/12345.obj",
        expected : []
      },


      // "eval" - value must be matched by a JavaScript expression; constraint specification is a string template which is preprocessed (substituting $val or ${_val} with the field value) and evaluated as JavaScript (with the return value cast to boolean, true meaning valid and false invalid); e.g. "$val > 0 && $val % 2 == 0" 

      {
        name: "eval",
        definition :   { 
          _type: "string",
          _limit: {
            eval: "$val > 0"
          } 
        },
        value : 2,
        expected : []
      },
      {
        name: "eval",
        definition :   { 
          _type: "string",
          _limit: {
            eval: "$val != 0"
          } 
        },
        value : 2,
        expected : []
      },
      {
        name: "eval",
        definition :   { 
          _type: "string",
          _limit: {
            eval: "$val > 0 && $val % 2 == 0"
          } 
        },
        value : 2,
        expected : []
      },
      {
        name: "eval",
        definition :   { 
          _type: "string",
          _limit: {
            eval: "$val > 0 && $val % 2 == 0 ||  $val > 200"
          } 
        },
        value : 11,
        expected : [{
          depth: "",
          error: "Value '11' returned FALSE on eval: $val > 0 && $val % 2 == 0 ||  $val > 200"
        }]
      },
      {
        name: "eval",
        definition :   { 
          _type: "string",
          _limit: {
            eval: "$val > 0 && $val % 2 == 0 ||  $val > 200"
          } 
        },
        value : null,
        expected : [{
          depth: "",
          error: "Value is null or undefined: null"
        }]
      },
      {
        name: "eval",
        definition :   { 
          _type: "string",
          _limit: {
            eval: "$val > -100 && $val < -50"
          } 
        },
        value : -75,
        expected : []
      },
      {
        name: "eval",
        definition :   { 
          _type: "string",
          _limit: {
            eval: "$val > 0 && $val % 2 == 0 || $val > 200 || $val > -100 && $val < -50"
          } 
        },
        value : -75,
        expected : []
      },
      {
        name: "eval",
        definition :   { 
          _type: "string",
          _limit: {
            eval: "$val > 0 && $val % 2 == 0 ||  $val > 200"
          } 
        },
        value : undefined,
        expected : [{
          depth: "",
          error: "Value is null or undefined: undefined"
        }]
      },
      {
        name: "eval",
        definition :   { 
          _type: "string",
          _limit: {
            eval: "$val > 0 && $val % 2 == 0 ||  $val > 200"
          } 
        },
        value : 201,
        expected : []
      },
      {
        name: "eval",
        definition :   { 
          _type: "string",
          _limit: {
            eval: "true"
          } 
        },
        value : "anything",
        expected : []
      },
      {
        name: "eval",
        definition :   { 
          _type: "string",
          _limit: {
            eval: "$val == 100"
          } 
        },
        value : 100,
        expected : []
      },
    ];

   for ( var i = 0; i < tests.length; i++ ) {
    var test = tests[i];
    var expected  = test.expected;
    var depth = "";
    var errors = [];

    // PROGRESS
    util.log(test.name + "   " + test.value + "  " + JSON.stringify(test.definition._limit) + "    " + JSON.stringify(expected), "FgGreen");

    var actual   = validator.validate(
      test.definition, 
      test.value,
      depth,
      errors);

    (expected).should.deep.equal(actual);
   }

  }); // it

 }); // describe

}


});
