define([
    'intern!bdd',
    'intern/chai!should',
    'intern/chai!expect',
    'intern/dojo/node!tracer/lib/index.js',
    'intern/dojo/node!../../../../../../../lib/commands/datatype',
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

    // var deferred = q.defer();

      var delay = 500;
      var dfd = this.async(delay, null);

    var testname = "validate";
    var tests = [
      // {
      //   inputfile :     "tests/unit/datatype/" + testname + "/inputs/good-uuid-bco-1.json",
      //   datatypesfile : "data/spec.json",
      //   expectedfile :  "tests/unit/datatype/" + testname + "/inputs/good-uuid-expected.json",
      // }
      // ,
      // {
      //   inputfile : "tests/unit/datatype/" + testname + "/inputs/bad-datatypes.json",
      //   expectedfile : "tests/unit/datatype/" + testname + "/outputs/bad-datatypes.json"
      // }
      // ,
      // {
      //   inputfile : "tests/unit/datatype/" + testname + "/inputs/bad-datatypes-children.json",
      //   expectedfile : "tests/unit/datatype/" + testname + "/outputs/bad-datatypes-children.json"
      // }
      // ,
      // {
      //   inputfile : "tests/unit/datatype/" + testname + "/inputs/bad-datatypes-children-twice.json",
      //   expectedfile : "tests/unit/datatype/" + testname + "/outputs/bad-datatypes-children-twice.json"
      // }
      // ,
      // {
      //   inputfile : "tests/unit/datatype/" + testname + "/inputs/good-datatypes.json",
      //   expectedfile : "tests/unit/datatype/" + testname + "/outputs/good-datatypes.json"
      // }
      // ,
      {
        inputfile : "tests/unit/bco/" + testname + "/inputs/good-datatypes-children-twice.json",
        expectedfile : "tests/unit/bco/" + testname + "/outputs/good-datatypes-children-twice.json"
      }
    ];

    for ( var i = 0; i < tests.length; i++ ) {
        var test = tests[i];

        // SHOW TEST FILE
        util.log(test.inputfile, "FgGreen");

        var expected = validator.util.jsonFileToData(test.expectedfile);
        // logger.log("expected", expected);

        var promise = validator.validate({
          definitions: test.datatypesfile,
          datatype: test.inputfile
        });

        promise.then( function ( actual ) {
          // logger.log("actual", actual);

          if ( (expected).should.deep.equal(actual) ) {
            dfd.resolve(true);
            // deferred.resolve(true);
          }
          else {
            // deferred.resolve(false);
            dfd.resolve(false);
          }
        })
      }

      return dfd.promise;

    }); // it

  }); // describe

}


});
