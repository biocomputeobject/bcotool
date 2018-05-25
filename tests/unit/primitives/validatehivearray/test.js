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

  describe("validateHIVEARRAY", function () {
    it("should validateHIVEARRAY", function () {

      var testname = "validateHIVEARRAY";
      var tests = [
        {
          definition :   {},
          value : { 
            "1": { "col1": 1, "col2": "x" }, 
            "2": { "col1": 2, "col2": "y" } 
          },
          expected : true
        },
        {
          definition :   {},
          value : [ 
            { "col1": 1, "col2": "x" }, 
            { "col1": 2, "col2": "y" } 
          ],
          expected : true
        },
        {
          definition :   {},
          value : [ 
            "some-string", 
            { "col1": 2, "col2": "y" }
          ],
          expected : false
        },
        {
          definition :   {},
          value : {
            "col1": 2, 
            "col2": "y"
          },
          expected : false
        },
        {
          definition :   {
            "_type": "hivearray",
            "_field": {
              "col1": {
                "_type": "integer"
              },
              "col2": {
                "_type": "string"
              }
            }
          },
          value : {
            "col1": 2, 
            "col2": "some-string"
          },
          expected : true
        },
        {
          definition :   {
            "_type": "hivearray",
            "_field": {
              "col1": {
                "_type": "integer"
              },
              "col2": {
                "_type": "string"
              }
            }
          },
          value : {
            "col1": 2, 
            "col2": [ "y" ]
          },
          expected : false
        }
      ];

      for ( var i = 0; i < tests.length; i++ ) {
        var test = tests[i];

        var expected    = test.expected;
        var actual      = primitives.validateHIVEARRAY(test.definition, test.value);

        // PROGRESS
        util.log( expected + "    " + JSON.stringify(test.value), "FgGreen");

        (expected).should.deep.equal(actual);
      }

    }); // it

  }); // describe


}


});
