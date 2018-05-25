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

  describe("validateUINT", function () {
    it("should validateUINT", function () {

    var tests = [
      {
        definition:  { 
          desc:     'An unsigned integer',
          datatype: 'UINT' 
        },
        value:     -1,
        expected: false
      },
      {
        definition:  { 
          desc:     'An unsigned integer',
          datatype: 'UINT' 
        },
        value:     1,
        expected: true
      }
    ];

    for ( var i = 0; i < tests.length; i++ ) {
      var test = tests[i];
      var expected    = test.expected;

      // SHOW TEST FILE
      util.log(test.value + ", expected: " + expected, "FgGreen");

      var actual = primitives.validateUINT(test.definition, test.value);
      // logger.log("actual", actual);
      // logger.log("expected", expected);

      (expected).should.deep.equal(actual);
    }

    }); // it

  }); // describe


} // with

});
