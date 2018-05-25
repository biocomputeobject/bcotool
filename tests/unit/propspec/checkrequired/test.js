define([
    'intern!bdd',
    'intern/chai!should',
    'intern/chai!expect',
    'intern/dojo/node!tracer/lib/index.js',
    'intern/dojo/node!../../../../../../../lib/commands/propspec',
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
      
      var testname = "checkrequired";
      var definition_files = [ 
        "data/bco/core.json",
        "data/bco/datatypes.json" 
      ];
      var tests = [
        {
          core_file: "data/hive/core.json",
          attribute_file: "data/hive/attributes.json",
          data_file : "tests/unit/propspec/" + testname + "/inputs/good-heptagon-propspec-one-attribute.json",
          expected_file : "tests/unit/propspec/" + testname + "/inputs/good-heptagon-propspec-one-attribute-expected.json"
        },
        {
          core_file: "data/hive/core.json",
          attribute_file: "data/hive/attributes.json",
          data_file : "tests/unit/propspec/" + testname + "/inputs/bad-heptagon-propspec-one-attribute.json",
          expected_file : "tests/unit/propspec/" + testname + "/inputs/bad-heptagon-propspec-one-attribute-expected.json"
        },
        {
          core_file: "data/hive/core.json",
          attribute_file: "data/hive/attributes.json",
          data_file : "tests/unit/propspec/" + testname + "/inputs/bad-heptagon-propspec-missing-attributes.json",
          expected_file : "tests/unit/propspec/" + testname + "/inputs/bad-heptagon-propspec-missing-attributes-expected.json"
        }
      ];

      var success = true;
      for ( var i = 0; i < tests.length; i++ ) {
        var test = tests[i];
        var expected = validator.util.jsonFileToData(test.expected_file);

        // SHOW TEST FILE
        util.log(test.data_file, "FgGreen");

        var core = validator.util.jsonFileToData(test.core_file);
        var data = validator.util.jsonFileToData(test.data_file);
        var depth = "";
        var errors = [];
        var actual = validator.checkRequired( core, data, depth, errors );
        // logger.log("actual", actual);
        // logger.log("expected", expected);

        (actual).should.deep.equal(expected);
      }

    }); // it

  }); // describe

}


});
