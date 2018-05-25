define([
    'intern!bdd',
    'intern/chai!should',
    'intern/chai!expect',
    'intern/dojo/node!tracer/lib/index.js',
    'intern/dojo/node!../../../../../../../lib/commands/hive',
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

      var testname = "validatefield";
      var tests = [
        {
          name: "name",
          definition: {
            "_type": "string"
          },
          value: [ "bad-array-should-be-string" ],
          expected: [{ 
            depth: "",
            error: "Field 'name' value '[\"bad-array-should-be-string\"]' does not match datatype 'string'"
          }]
        },
      ];

      for ( var i = 0; i < tests.length; i++ ) {
        var test = tests[i];

        var expected    = test.expected;
        var depth       = "";
        var errors      = [];
        var actual      = validator.validateField(test.definition, test.value, test.name, depth, errors);
        console.log("errors", errors);

        // PROGRESS
        util.log(test.value + "    " + actual, "FgGreen");

        (actual).should.deep.equal(expected);
      }

    }); // it

  }); // describe

}


});
