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


  describe("missingRequired", function () {
    it(
    "should verify if required fields are missing from a data object", 
    function () {
    
      var testname = "missingrequired";
      var definitionfile = "data/core.json";
      var tests = [
        {
          datafile : "tests/unit/datatype/" + testname + "/inputs/good-date.json",
          expected : []
        }
        ,
        {
          datafile : "tests/unit/datatype/" + testname + "/inputs/bad-date.json",
          expected :  [ 
            { 
              depth: "", 
              error: "required field 'desc' not present" 
            } 
          ]
        }
        ,
        {
          datafile : "tests/unit/datatype/" + testname + "/inputs/bad-email.json",
          expected :  [ 
            { 
              depth: "", 
              error: "required field 'desc' not present" 
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
        var definitions = validator.util.jsonFileToData(definitionfile);
        // logger.log("data_objects", data_objects);

        try {
          for ( var data_object_name in data_objects ) {
            var errors = [];
            var depth = "";
            var actual = validator.missingRequired(definitions, data_objects[data_object_name], depth, errors);
            // logger.log("actual", actual);

            actual.should.deep.equal(expected);
          }          
        }
        catch (err) {
          logger.log("err", err);
        }
      }
    });
  });

}


});
