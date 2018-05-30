define([
    'intern!bdd',
    'intern/chai!should',
    'intern/chai!expect',
    'intern/dojo/node!tracer/lib/index.js',
    'intern/dojo/node!../../../../../../../lib/commands/datatype',
    'intern/dojo/node!../../../../../../../lib/commands/common',
    'intern/dojo/node!../../../../../../../lib/utils/util',
    "intern/dojo/node!JSON",
    "intern/dojo/node!fs",
    "intern/dojo/node!../../../../../../../tests/support/lib/util" 
], function (

bdd, 
should,
expect,
Tracer,
validator,
common,
commonUtil,
JSON,
fs,
util

) {
should();
with (bdd) {

  var logger = new Tracer.console();

  describe("recursiveValidate", function () {
    it(
      
  "should recursively validate all fields and child fields in the datatype entry", 

  function () {

    var delay = 500;
    var dfd = this.async(delay, null);
    var testname = "recursivevalidate";
    var definitionfile = "data/core.json";
    var tests = [
      {
        datafile : "tests/unit/datatype/" + testname + "/inputs/good-xref-nested-children.json",
        expected : []
      }
      ,
      {
        datafile : "tests/unit/datatype/" + testname + "/inputs/good-double-nested-children.json",
        expected : []
      }
      ,
      {
        datafile : "tests/unit/datatype/" + testname + "/inputs/good-fhir-diagnostics.json",
        expected : []
      }
      ,
      {
        datafile : "tests/unit/datatype/" + testname + "/inputs/good-fhir-one-child.json",
          expected : [],
      }
      ,
      {
        datafile : "tests/unit/datatype/" + testname + "/inputs/good-fhir-url.json",
          expected : [],
      }
      ,
      {
        datafile : "tests/unit/datatype/" + testname + "/inputs/good-fhir-w-children.json",
          expected : [],
      }
      ,
      {
        datafile : "tests/unit/datatype/" + testname + "/inputs/bad-fhir-diagnostics.json",
        expected : [
          { 
            depth: "FHIR:children:0:diagnostics", 
            error: "required field 'desc' not present" 
          },
          { 
            depth: "FHIR:children:0:diagnostics",
            error: "No 'datatype' or 'children' field defined" 
          }
        ]
      }
      ,
      {
        datafile : "tests/unit/datatype/" + testname + "/inputs/bad-fhir-diagnostics-one.json",
        expected : [
          {
            "depth": "FHIR:children:0:diagnostics",
            "error": "required field 'desc' not present"
          },
          { 
            depth: "FHIR:children:0:diagnostics",
            error: "No 'datatype' or 'children' field defined" 
          }
        ]
      }
    ];

    for ( var i = 0; i < tests.length; i++ ) {
        var test = tests[i];
        var expected = test.expected;

        // MONITOR
        util.log(test.datafile, "FgGreen");

        var data_objects = commonUtil.jsonFileToData(test.datafile);
        // logger.log("data_objects", data_objects);
        var definitions = commonUtil.jsonFileToData(definitionfile);
        // logger.log("definitions", definitions);

        var depth = "";
        var errors = [];

        for ( var data_object_name in data_objects ) {
          var data_object = data_objects[data_object_name];
          // logger.log("data_object", data_object);

          errors = validator.recursiveValidate(definitions, definitions, data_objects, data_object, data_object_name, errors);
        }
        actual = errors;
        // logger.log("actual", actual);

        if ( (expected).should.deep.equal(actual) ) {
          dfd.resolve(true);
          // deferred.resolve(true);
        }
        else {
          // deferred.resolve(false);
          dfd.resolve(false);
        }
      
      return dfd.promise;

      }

    }); // it

  }); // describe


}


});
