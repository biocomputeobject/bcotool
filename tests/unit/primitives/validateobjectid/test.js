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

  describe("validateOBJECTID", function () {
    it("should validateOBJECTID", function () {

      var testname = "validateOBJECTID";
      var tests = [
        {
          definition :   { 
            desc: 'A base 16 number', 
            datatype: 'OBJECTID', 
            value: '[0-9]' 
          },
          value : "type.123456",
          expected : true
        }
        ,
        {
          definition :   { 
            desc: 'A base 16 number', 
            datatype: 'OBJECTID', 
            value: '[0-9]' 
          },
          value : "type",
          expected : false
        }
        ,
        {
          definition :   { 
            desc: 'A base 16 number', 
            datatype: 'OBJECTID', 
            value: '[0-9]' 
          },
          value : "http://123.com",
          expected : true
        }
        ,
        {
          definition :   { 
            desc: 'A base 16 number', 
            datatype: 'OBJECTID', 
            value: '[0-9]' 
          },
          value : "1234567890",
          expected : true
        }
        ,
        {
          definition :   { 
            desc: 'A base 16 number', 
            datatype: 'OBJECTID', 
            value: '[0-9]' 
          },
          value : "1234567890abcdef",
          expected : false
        }
        ,
        {
          definition :   { 
            desc: 'A base 16 number', 
            datatype: 'OBJECTID', 
            value: '[0-9]' 
          },
          value : "123.type.12345",
          expected : false
        }
      ];

      for ( var i = 0; i < tests.length; i++ ) {
        var test = tests[i];
        var expected    = test.expected;
        var actual = primitives.validateOBJECTID(test.definition, test.value);

        // PROGRESS
        util.log(test.value + "    " + actual);

        // logger.log("expected", expected);
        // logger.log("actual", actual);

        (expected).should.deep.equal(actual);
      }

    }); // it

  }); // describe


}


});
