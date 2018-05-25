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

  describe("datatypeDefined", function () {
    it(
    "should verify if data object contains only one 'datatype' or 'children' field", 
    function () {
    
      var testname = "datatypedefined";
      var tests = [
        {
          datafile : "tests/unit/datatype/" + testname + "/inputs/good-date.json",
          expected : []
        }
        ,
        {
          datafile : "tests/unit/datatype/" + testname + "/inputs/bad-date.json",
          expected : [
            {
              "depth": "",
              "error": "Multiple fields defined: datatype, children"
            }
          ]
        }
        ,
        {
          datafile : "tests/unit/datatype/" + testname + "/inputs/bad-email.json",
          expected : [
            {
              "depth": "",
              "error": "No 'datatype' or 'children' field defined"
            }
          ]
        }
      ];

      for ( var i = 0; i < tests.length; i++ ) {
        var test = tests[i];
        var datafile = test.datafile;
        var expected = test.expected;
        // logger.log("expected", expected);
        
        // MONITOR
        util.log(datafile, "FgGreen");

        var data_objects = validator.util.jsonFileToData(datafile);
        // logger.log("data_objects", data_objects);

        var errors = [];
        var depth = "";
        for ( var data_object_name in data_objects ) {
          errors = validator.datatypeDefined(data_objects[data_object_name], depth, errors);

        }
        var actual = errors;
        // logger.log("actual", actual);

        actual.should.deep.equal(expected);
      }
    });
  });
}


});
