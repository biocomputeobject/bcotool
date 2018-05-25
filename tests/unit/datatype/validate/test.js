define([
    'intern!bdd',
    'intern/chai!should',
    'intern/chai!expect',
    'intern/dojo/node!tracer/lib/index.js',
    'intern/dojo/node!../../../../../../../lib/commands/datatype',
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
    it("should validate a datatype file", function () {

    var delay = 500;
    var dfd = this.async(delay, null);
    var testname = "validate";
    var definition_files = [ 
      "data/bco/core.json",
      "data/bco/datatypes.json" 
    ];
    var tests = [
      {
        data_file : "tests/unit/datatype/" + testname + "/inputs/bad-datatypes.json",
        expectedfile : "tests/unit/datatype/" + testname + "/inputs/bad-datatypes-expected.json"
      }
      ,
      {
        data_file : "tests/unit/datatype/" + testname + "/inputs/bad-datatypes-children.json",
        expectedfile : "tests/unit/datatype/" + testname + "/inputs/bad-datatypes-children-expected.json"
      }
      ,
      {
        data_file : "tests/unit/datatype/" + testname + "/inputs/bad-datatypes-children-twice.json",
        expectedfile : "tests/unit/datatype/" + testname + "/inputs/bad-datatypes-children-twice-expected.json"
      }
      ,
      {
        data_file : "tests/unit/datatype/" + testname + "/inputs/good-datatypes.json",
        expectedfile : "tests/unit/datatype/" + testname + "/inputs/good-datatypes-expected.json"
      }
      ,
      {
        data_file : "tests/unit/datatype/" + testname + "/inputs/good-datatypes-children-twice.json",
        expectedfile : "tests/unit/datatype/" + testname + "/inputs/good-datatypes-children-twice-expected.json"
      }
    ];

    for ( var i = 0; i < tests.length; i++ ) {
        var test = tests[i];

        var expected = validator.util.jsonFileToData(test.expectedfile);

        // SHOW TEST FILE
        util.log(test.data_file, "FgGreen");

        validator.validate({
          data_file: test.data_file,
          definition_files: definition_files
        })
        .then( function ( actual ) {
          // logger.log("actual", actual);
          // logger.log("expected", expected);

          if ( (expected).should.deep.equal(actual) ) {
            dfd.resolve(true);
          }
          else {
            dfd.resolve(false);
          }

        })

      }

      return dfd.promise;

    }); // it

  }); // describe

}


});
