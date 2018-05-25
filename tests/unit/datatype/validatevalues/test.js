define([
    'intern!bdd',
    'intern/chai!should',
    'intern/chai!expect',
    'intern/dojo/node!tracer/lib/index.js',
    'intern/dojo/node!../../../../../../../lib/commands/datatype',
    "intern/dojo/node!JSON",
    "intern/dojo/node!fs",
    "intern/dojo/node!../../../../../../../tests/support/lib/util" 
], function (

bdd, 
should,
expect,
Tracer,
validator,
JSON,
fs,
util

) {
should();
with (bdd) {

  var logger = new Tracer.console();

  describe("validateValues", function () {
    it(
      
  "should validate all fields in the datatype entry", 
  function () {

    var testname = "validatevalues";
    var definitionfile = "data/bco/core.json";
    var primitivesfile = "data/bco/primitives.json";
    var tests = [
      {
        datafile : "tests/unit/datatype/" + testname + "/inputs/good-date.json",
        expected : [],
      }
      ,
      {
        datafile : "tests/unit/datatype/" + testname + "/inputs/bad-date.json",
        expected : [
          { 
            depth: "DATE:datatype",
            error: "field value '123' does not match datatype 'TEXT'" 
          }
        ]
      }
      ,
      {
        datafile : "tests/unit/datatype/" + testname + "/inputs/good-type-w-values.json",
        expected : [],
      }
      ,
      {
        datafile : "tests/unit/datatype/" + testname + "/inputs/good-fhir-w-children.json",
        expected : [],
      }
      ,
      {
        datafile : "tests/unit/datatype/" + testname + "/inputs/bad-number.json",
        expected : [
          {
            depth: "ORDINAL:count",
            error: "field value 'abc' does not match datatype 'NUMBER'"
          }
        ]
      }
      ,
      {
        datafile : "tests/unit/datatype/" + testname + "/inputs/good-number.json",
        expected : []
      }
    ];

    for ( var i = 0; i < tests.length; i++ ) {
        var test = tests[i];
        var datafile = test.datafile;
        var expected = test.expected;

        // MONITOR
        util.log(datafile, "FgGreen");

        var data_objects = validator.util.jsonFileToData(datafile);
        // logger.log("data_objects", data_objects);
        var definitions = validator.util.jsonFileToData(definitionfile);
        // logger.log("definitions", definitions);

        var errors = [];
        for ( var data_object_name in data_objects ) {
          // logger.log("data_object_name", data_object_name);
          var data_object = data_objects[data_object_name];
          // logger.log("data_object", data_object);

          errors = validator.validateValues( definitions, definitions, data_objects, data_object, data_object_name, errors );
        }
        var actual = errors;
        // logger.log("actual", actual);

        actual.should.deep.equal(expected);
      }
    });
  });

}


});
