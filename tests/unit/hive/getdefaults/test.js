define([
    'intern!bdd',
    'intern/chai!should',
    'intern/chai!expect',
    'intern/dojo/node!tracer/lib/index.js',
    'intern/dojo/node!../../../../../../../lib/commands/hive',
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

  describe("getdefaults", function () {
    it("should populate default values if field is absent", function () {

    var testname = "getdefaults";
    var tests = [

      {
        propspec_file:  "tests/unit/hive/" + testname + "/inputs/good-heptagon-noise-propspec.json",
        data_file:      "tests/unit/hive/" + testname + "/inputs/good-heptagon-noise.json",
        expected_file:  "tests/unit/hive/" + testname + "/inputs/good-heptagon-noise-expected.json",
        data_key: "noise"
      },

      {
        propspec_file:  "tests/unit/hive/" + testname + "/inputs/good-heptagon-one-default-propspec.json",
        data_file:      "tests/unit/hive/" + testname + "/inputs/good-heptagon-one-default.json",
        expected_file:  "tests/unit/hive/" + testname + "/inputs/good-heptagon-one-default-expected.json"
      },

      {
        propspec_file:  "tests/unit/hive/" + testname + "/inputs/good-heptagon-two-defaults-propspec.json",
        data_file:      "tests/unit/hive/" + testname + "/inputs/good-heptagon-two-defaults.json",
        expected_file:  "tests/unit/hive/" + testname + "/inputs/good-heptagon-two-defaults-expected.json"
      },

      {
        propspec_file:  "tests/unit/hive/" + testname + "/inputs/good-heptagon-four-defaults-propspec.json",
        data_file:      "tests/unit/hive/" + testname + "/inputs/good-heptagon-four-defaults.json",
        expected_file:  "tests/unit/hive/" + testname + "/inputs/good-heptagon-four-defaults-expected.json"
      },

      {
        propspec_file:  "tests/unit/hive/" + testname + "/inputs/bad-heptagon-one-default-propspec.json",
        data_file:      "tests/unit/hive/" + testname + "/inputs/bad-heptagon-one-default.json",
        expected_file:  "tests/unit/hive/" + testname + "/inputs/bad-heptagon-one-default-expected.json"
      },

    ];

    for ( var i = 0; i < tests.length; i++ ) {
        var test = tests[i];
        var data_key = test.data_key;
        var expected = validator.util.jsonFileToData(test.expected_file);

        // SHOW TEST FILE
        util.log(test.data_file, "FgGreen");

        var data_object = validator.util.jsonFileToData(test.data_file);
        var definition = validator.util.jsonFileToData(test.propspec_file);

        var actual = validator.getDefaults( definition, data_object );
        // console.log("actual", actual);
        // console.log("expected", expected);
        (actual).should.deep.equal(expected);
      }

    }); // it

  }); // describe

}


});
