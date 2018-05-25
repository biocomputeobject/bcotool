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

  describe("validateREGEX", function () {
    it("should validateREGEX", function () {

      var testname = "validateREGEX";
      var tests = [
        {
          definition :   { 
            desc: 'A base 16 number', 
            datatype: 'REGEX', 
            value: '[0-9]' 
          },
          value : "1",
          expected : true
        }
        ,
        {
          definition :   { 
            desc: 'A base 16 number', 
            datatype: 'REGEX', 
            value: '[0-9]$' 
          },
          value : "b1",
          expected : true
        }
        ,
        {
          definition :   { 
            desc: 'A base 16 number', 
            datatype: 'REGEX', 
            value: '^[0-9]$' 
          },
          value : "b1",
          expected : false
        }
        ,
        {
          definition :   { 
            desc: 'A base 16 number', 
            datatype: 'REGEX', 
            value: '^[0-9]$' 
          },
          value : "12",
          expected : false
        }
        ,
        {
          definition :   { 
            desc: 'A base 16 number', 
            datatype: 'REGEX', 
            value: '^[0-9]+$' 
          },
          value : "12",
          expected : true
        },
        {
          definition:  { 
            desc:     'A base 16 number',
            datatype: 'REGEX',
            value:    '^[0-9A-Fa-f]\+$' 
          },
          value:     "0123456789abcdef",
          expected: true
        }
        ,
        {
          definition:  { 
            desc:     'A base 16 number',
            datatype: 'REGEX',
            value:    '^[0-9A-Fa-f]+$' 
          },
          value:     "0123456789abcdefg",
          expected: false
        }
        ,
        {
          definition:  { 
            desc:     "Email address with full domain name, e.g.: 'myname@domain.com', 'name2@domain.io', 'name3@domain.info'",
            datatype: "REGEX",
            value:    "^[\\w-]+\\@[\\w\\.]+\\.\\w{2,4}$"
          },
          value:      "name3@domain.info",
          expected:   true
        }
        ,
        {
          definition:  { 
            desc:     "Email address with full domain name, e.g.: 'myname@domain.com', 'name2@domain.io', 'name3@domain.info'",
            datatype: "REGEX",
            value:    "^[\\w-]+\\@[\\w\\.]+\\.\\w{2,4}$"
          },
          value:      "name2@domain.io",
          expected:   true
        }
        ,
        {
          definition:  { 
            desc:     "Email address with full domain name, e.g.: 'myname@domain.com', 'name2@domain.io', 'name3@domain.info'",
            datatype: "REGEX",
            value:    "^[\\w-]+\\@[\\w\\.]+\\.\\w{2,4}$"
          },
          value:      "name;2@domain.io",
          expected:   false
        }
      ];

      for ( var i = 0; i < tests.length; i++ ) {
        var test = tests[i];

        // SHOW TEST FILE
        util.log(test.value + " vs " + test.definition.value, "FgGreen");

        var expected    = test.expected;
        var actual = primitives.validateREGEX(test.definition, test.value);

        (expected).should.deep.equal(actual);
      }

    }); // it

  }); // describe


}


});
