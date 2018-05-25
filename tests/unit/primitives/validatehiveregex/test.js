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

  describe("validateHIVEREGEX", function () {
    it("should validateHIVEREGEX", function () {

      var testname = "validateREGEX";
      var tests = [
        {
          definition :   { 
            _type: "regex",
            _limit: {
              "regex": "^[0-9]$"
            } 
          },
          value : 1,
          expected : true
        },
        {
          definition :   { 
            _type: "regex",
            _limit: {
              "regex": "^[0-9]$"
            } 
          },
          value : "abc",
          expected : false
        },
        {
          definition :   { 
            _type: "regex",
            _limit: {
              "regex": "^(\\d+|[a-z_][a-z0-9_]{0,7}\.\\d+|http.*:\\S+)$"
            } 
          },
          value : "12345678",
          expected : true
        },
        {
          definition :   { 
            _type: "regex",
            _limit: {
              "regex": "^(\\d+|[a-z_][a-z0-9_]{0,7}\.\\d+|http.*:\\S+)$"
            } 
          },
          value : "obj.12345",
          expected : true
        },
        {
          definition :   { 
            _type: "regex",
            _limit: {
              "regex": "^(\\d+|[a-z_][a-z0-9_]{0,7}\.\\d+|http.*:\\S+)$"
            } 
          },
          value : "12345.obj",
          expected : false
        },
        {
          definition :   { 
            _type: "regex",
            _limit: {
              "regex": "^(\\d+|[a-z_][a-z0-9_]{0,7}\.\\d+|http.*:\\S+)$"
            } 
          },
          value : "http://site.com/12345.obj",
          expected : true
        }
      ];

      for ( var i = 0; i < tests.length; i++ ) {
        var test = tests[i];

        // SHOW TEST FILE
        util.log(test.value + " vs " + test.definition._limit.regex, "FgGreen");

        var expected    = test.expected;
        var actual = primitives.validateHIVEREGEX(test.definition, test.value);
        // console.log("expected", expected);
        // console.log("actual", actual);

        (expected).should.deep.equal(actual);
      }

    }); // it

  }); // describe


}


});
