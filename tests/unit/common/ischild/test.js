define([
    'intern!bdd',
    'intern/chai!should',
    'intern/chai!expect',
    'intern/dojo/node!tracer/lib/index.js',
    'intern/dojo/node!../../../../../../../lib/commands/common',
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
common,
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

  describe("getDefinition", function () {
    it("should get the definition for a data object", function () {

    var testname = "getdefinition";
    var definition_file = "data/bco/spec.json";

    var tests = [
      {
        depth    :    "RANGE:children:start",
        expected :    true
      }
      ,
      {
        depth    :    "RANGE:children:start:datatype",
        expected :    false
      }
    ];

    for ( var i = 0; i < tests.length; i++ ) {
      var test = tests[i];

      // SHOW TEST FILE
      util.log(test.depth + "   " + test.expected, "FgGreen");

      var actual = common.isChild(test.depth);
      // logger.log("actual", actual);
      // logger.log("expected", test.expected);

      (test.expected).should.deep.equal(actual);
    }

    }); // it

  }); // describe

}


});
