define([
    'intern!bdd',
    'intern/chai!should',
    'intern/chai!expect',
    'intern/dojo/node!tracer/lib/index.js',
    'intern/dojo/node!../../../../../../../lib/commands/get',
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

  describe("get", function () {
    it("should retrieve data objects from data file based on bcotool validation error output", function () {
    var delay = 500;
    var dfd = this.async(delay, null);

    var testname = "get";
    var tests = [
      {
        data_file:      "tests/unit/get/" + testname + "/inputs/heptagon-missing-comment-errors.json",
        expected_file:  "tests/unit/get/" + testname + "/inputs/heptagon-missing-comment-expected.json",
      }
    ];

    for ( var i = 0; i < tests.length; i++ ) {
        var test = tests[i];
        var expected = validator.util.jsonFileToData(test.expected_file);

        // SHOW TEST FILE
        util.log(test.data_file, "FgGreen");

        var json = fs.readFileSync( test.data_file ).toString();
        var data = JSON.parse(json);
        data.file = "tests/unit/get/" + testname + "/inputs/" + data.file;
        // logger.log("data", data);
        json = JSON.stringify(data);

        var actual = validator.get( json )
        .then( function ( actual ) {
          // logger.log("actual", actual);
          // logger.log("expected", expected);

          if ( (expected).should.deep.equal(actual) ) {
            dfd.resolve(true);
          }
          else {
            dfd.resolve(false);
          }
        });
      
      } // for

      return dfd.promise;

    }); // it

  }); // describe

}


});
