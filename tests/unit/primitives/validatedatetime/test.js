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

  describe("validateDATETIME", function () {
    it("should validateDATETIME", function () {

    var testname = "validateDATETIME";
    var tests = [
      {
        definition :   { 
          desc: 'Datetime', 
          datatype: 'DATETIME'
        },
        value : "Jan 24, 2017 09:40:17",
        expected : true
      }
      ,
      {
        definition :   { 
          desc: 'Datetime', 
          datatype: 'DATETIME'
        },
        value : "Jan 24th, 2017 09:40:17",
        expected : false
      }
      ,
      {
        definition :   { 
          desc: 'Datetime', 
          datatype: 'DATETIME'
        },
        value : "2016-05-26T16:43:30-04:00",
        expected : true
      }
    ];

    for ( var i = 0; i < tests.length; i++ ) {
        var test = tests[i];
        var expected   = test.expected;
        var value      = test.value;
        var definition = test.definition;
        var regex      = definition.value;

        // SHOW REGEX
        util.log(value + " " + expected, "FgGreen");

        var actual = primitives.validateDATETIME(definition, value);
        actual.should.deep.equal(expected);
      }

    }); // it

  }); // describe

}


});
