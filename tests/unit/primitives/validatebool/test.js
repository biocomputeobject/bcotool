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

  describe("validateBOOL", function () {
    it("should validateBOOL", function () {

      var testname = "validateBOOL";
      var tests = [
        {
          definition :   {},
          value : "1",
          expected : false
        }
        ,
        {
          definition :   {},
          value : "some text",
          expected : false
        },
        ,
        {
          definition :   {},
          value : [ "an array" ],
          expected : false
        }
      ];

      for ( var i = 0; i < tests.length; i++ ) {
        var test = tests[i];

        // SHOW TEST FILE
        util.log(test.value + " vs " + test.definition.value, "FgGreen");

        var expected    = test.expected;
        var actual = primitives.validateBOOL(test.definition, test.value);

        (expected).should.deep.equal(actual);
      }

    }); // it

  }); // describe


}


});
