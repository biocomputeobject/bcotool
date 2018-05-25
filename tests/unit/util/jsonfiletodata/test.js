define([
    'intern!bdd',
    'intern/chai!should',
    'intern/chai!expect',
    'intern/dojo/node!tracer/lib/index.js',
    'intern/dojo/node!../../../../../../../lib/utils/util',
    "intern/dojo/node!JSON",
    "intern/dojo/node!fs",
    "intern/dojo/node!../../../../../../../tests/support/lib/util" 
], function (

bdd, 
should,
expect,
Tracer,
util,
JSON,
fs,
testUtil

) {
should();
with (bdd) {

  var logger = new Tracer.console();

  describe("jsonFileToData", function () {
    it("should read JSON file, parse out comments and return as object", function () {

      var testname = "jsonfiletodata";
      var tests = [
        {
          inputfile : "tests/unit/util/" + testname + "/inputs/good-datatype-definition.json",
          expected : true,
        }
        ,
        {
          inputfile : "tests/unit/util/" + testname + "/inputs/good-datatypes.json",
          expected : true,
        }
        ,
        {
          inputfile : "tests/unit/util/" + testname + "/inputs/bad-bco-datatypes.json",
          expected : false,
        }
        ,
        {
          inputfile : "tests/unit/util/" + testname + "/inputs/datatype-definition.json",
          expected : false,
        }
        ,
        {
          inputfile : "tests/unit/util/" + testname + "/inputs/bco-datatypes.json",
          expected : false,
        }
        ,
        {
          inputfile : "tests/unit/util/" + testname + "/inputs/bco-definition.json",
          expected : false,
        },
        {
          inputfile : "tests/unit/util/" + testname + "/inputs/replace-slash.json",
          expectedfile : "tests/unit/util/" + testname + "/inputs/replace-slash-expected.json",
        }
      ];

      for ( var i = 0; i < tests.length; i++ ) {
        var test = tests[i];
        // logger.log("test", test);
        var inputfile = test.inputfile;
        testUtil.log(inputfile, "FgGreen");
        var expected = test.expected;
        if ( test.expectedfile ) {
          var contents = fs.readFileSync(test.expectedfile, 'utf8');
          // logger.trace("READ FROM FILE contents", contents);
          expected = JSON.parse(contents);
          // logger.log("expected", expected);

          var actual = util.jsonFileToData(inputfile);
          // logger.log("actual", actual);
          
          actual.should.deep.equal(expected);
        }
        else {
          try {
            var data = util.jsonFileToData(inputfile);
            // logger.log("data", data);             
            (expected).should.be.true;
          }
          catch (error) {
            // logger.log("error", error);
            (expected).should.be.false;
          }
        }
      }

    }); // it

  }); // describe


}


});
