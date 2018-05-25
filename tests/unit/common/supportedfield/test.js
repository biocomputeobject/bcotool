define([
    'intern!bdd',
    'intern/chai!should',
    'intern/chai!expect',
    'intern/dojo/node!tracer/lib/index.js',
    'intern/dojo/node!../../../../../../../lib/commands/common',
    'intern/dojo/node!../../../../../../../lib/utils/util',
    "intern/dojo/node!JSON",
    "intern/dojo/node!fs",
    "intern/dojo/node!../../../../../../../tests/support/lib/util" 
], function (

bdd, 
should,
expect,
Tracer,
common,
commonUtil,
JSON,
fs,
util

) {
should();
with (bdd) {

  var logger = new Tracer.console();

  describe("supportedField", function () {
    it(
    "should verify if field is supported", 
    function () {
    
      var definitionfile = "data/bco/core.json";
      var tests = [
        {
          datafile : "tests/unit/common/supportedfield/inputs/bad-not-supported.json",
          expected : false
        },
        {
          datafile : "tests/unit/common/supportedfield/inputs/bad-desc.json",
          expected : false
        },
        {
          datafile : "tests/unit/common/supportedfield/inputs/good-desc.json",
          expected : true
        },
        {
          datafile : "tests/unit/common/supportedfield/inputs/good-datatype.json",
          expected : true
        },
        {
          datafile : "tests/unit/common/supportedfield/inputs/good-value.json",
          expected : true
        }
      ];

      for ( var i = 0; i < tests.length; i++ ) {
        var test = tests[i];
        // logger.log("test", test);
        var datafile = test.datafile;
        var expected = test.expected;
        
        // MONITOR
        util.log(datafile, "FgGreen");

        var dataobject = commonUtil.jsonFileToData(datafile);
        var definitions = commonUtil.jsonFileToData(definitionfile);
        // logger.log("dataobject", dataobject);
        // logger.log("definitions", definitions);

        for ( var dataobject_field in dataobject ) {
          var actual = common.supportedField(definitions, dataobject_field);
          // logger.log("actual", actual);

          actual.should.deep.equal(expected);
        }
      }
    });
  });

}


});
