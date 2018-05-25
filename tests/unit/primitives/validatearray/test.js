define([
    'intern!bdd',
    'intern/chai!should',
    'intern/chai!expect',
    'intern/dojo/node!tracer/lib/index.js',
    'intern/dojo/node!../../../../../../../lib/commands/primitives',
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
primitives,
JSON,
q,
fs,
async,
util

) {
should();
with (bdd) {

  var logger = new Tracer.console();

  describe("validateARRAY", function () {
    it("should validateARRAY", function () {

      var testname = "validateARRAY";
      var tests = [
        {
          definition :   {},
          value : "1",
          expected : false
        },
        {
          definition :   {},
          value : [ "array" ],
          expected : true
        },
        {
          definition :   {},
          value : { "one" : 1, "two": 2 },
          expected : false
        }
      ];

      for ( var i = 0; i < tests.length; i++ ) {
        var test = tests[i];

        var expected    = test.expected;
        var actual      = primitives.validateARRAY(test.definition, test.value);

        // PROGRESS
        util.log(test.value + "    " + actual, "FgGreen");

        (expected).should.deep.equal(actual);
      }

    }); // it

  }); // describe


}


});
