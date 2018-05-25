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

  describe("validateattributes", function () {
    it("should validate the attributes of a data object", function () {

      var testname = "validateattributes";
      var tests = [

        // {
        //   propspec_file    : "data/hive/svc-profiler-heptagon-propspec.json",
        //   data_file         : "tests/unit/hive/" + testname + "/inputs/bad-heptagon-system-missing-action.json",
        //   expected_file     : "tests/unit/hive/" + testname + "/inputs/bad-heptagon-system-missing-action-expected.json"
        // },

        {
          propspec_file    : "data/hive/svc-profiler-heptagon-propspec.json",
          data_file        : "tests/unit/hive/" + testname + "/inputs/bad-heptagon-twice-nested-batch.json",
          expected_file     : "tests/unit/hive/" + testname + "/inputs/bad-heptagon-twice-nested-batch-expected.json"
        },

        // {
        //   propspec_file    : "data/hive/svc-profiler-heptagon-propspec.json",
        //   data_file        : "tests/unit/hive/" + testname + "/inputs/good-heptagon-nested-system.json",
        //   expected_file     : "tests/unit/hive/" + testname + "/inputs/good-heptagon-nested-system-expected.json"
        // },

        // {
        //   propspec_file    : "tests/unit/hive/" + testname + "/inputs/good-array-ismulti-children-propspec.json",
        //   data_file        : "tests/unit/hive/" + testname + "/inputs/good-array-ismulti-children.json",
        //   expected_file     : "tests/unit/hive/" + testname + "/inputs/good-array-ismulti-children-expected.json"
        // },

        // {
        //   propspec_file    : "tests/unit/hive/" + testname + "/inputs/bad-array-ismulti-children-propspec.json",
        //   data_file        : "tests/unit/hive/" + testname + "/inputs/bad-array-ismulti-children.json",
        //   expected_file     : "tests/unit/hive/" + testname + "/inputs/bad-array-ismulti-children-expected.json"
        // },

        // {
        //   propspec_file    : "tests/unit/hive/" + testname + "/inputs/good-list-ismulti-children-propspec.json",
        //   data_file        : "tests/unit/hive/" + testname + "/inputs/good-list-ismulti-children.json",
        //   expected_file     : "tests/unit/hive/" + testname + "/inputs/good-list-ismulti-children-expected.json"
        // },

        // {
        //   propspec_file    : "tests/unit/hive/" + testname + "/inputs/bad-list-ismulti-children-propspec.json",
        //   data_file        : "tests/unit/hive/" + testname + "/inputs/bad-list-ismulti-children.json",
        //   expected_file     : "tests/unit/hive/" + testname + "/inputs/bad-list-ismulti-children-expected.json"
        // },

        // {
        //   propspec_file    : "tests/unit/hive/" + testname + "/inputs/bad-multi-array-not-string-propspec.json",
        //   data_file        : "tests/unit/hive/" + testname + "/inputs/bad-multi-array-not-string.json",
        //   expected_file     : "tests/unit/hive/" + testname + "/inputs/bad-multi-array-not-string-expected.json"
        // },

        // {
        //   propspec_file    : "tests/unit/hive/" + testname + "/inputs/bad-multi-hash-not-string-propspec.json",
        //   data_file        : "tests/unit/hive/" + testname + "/inputs/bad-multi-hash-not-string.json",
        //   expected_file     : "tests/unit/hive/" + testname + "/inputs/bad-multi-hash-not-string-expected.json"
        // },

        // {
        //   propspec_file    : "tests/unit/hive/" + testname + "/inputs/bad-string-not-multi-propspec.json",
        //   data_file        : "tests/unit/hive/" + testname + "/inputs/bad-string-not-multi.json",
        //   expected_file     : "tests/unit/hive/" + testname + "/inputs/bad-string-not-multi-expected.json"
        // },

        // {
        //   propspec_file    : "tests/unit/hive/" + testname + "/inputs/good-array-children-propspec.json",
        //   data_file        : "tests/unit/hive/" + testname + "/inputs/good-array-children.json",
        //   expected_file     : "tests/unit/hive/" + testname + "/inputs/good-array-children-expected.json"
        // },

        // {
        //   propspec_file    : "tests/unit/hive/" + testname + "/inputs/good-array-not-multi-propspec.json",
        //   data_file        : "tests/unit/hive/" + testname + "/inputs/good-array-not-multi.json",
        //   expected_file     : "tests/unit/hive/" + testname + "/inputs/good-array-not-multi-expected.json"
        // },

        // {
        //   propspec_file    : "tests/unit/hive/" + testname + "/inputs/good-array-multi-propspec.json",
        //   data_file        : "tests/unit/hive/" + testname + "/inputs/good-array-multi.json",
        //   expected_file     : "tests/unit/hive/" + testname + "/inputs/good-array-multi-expected.json"
        // },

        // {
        //   propspec_file    : "tests/unit/hive/" + testname + "/inputs/good-twice-nested-batch-propspec.json",
        //   data_file        : "tests/unit/hive/" + testname + "/inputs/good-twice-nested-batch.json",
        //   expected_file     : "tests/unit/hive/" + testname + "/inputs/good-twice-nested-batch-expected.json"
        // },

        // {
        //   propspec_file    : "tests/unit/hive/" + testname + "/inputs/good-list-no-multi-propspec.json",
        //   data_file        : "tests/unit/hive/" + testname + "/inputs/good-list-no-multi.json",
        //   expected_file     : "tests/unit/hive/" + testname + "/inputs/good-list-no-multi-expected.json"
        // },

        // {
        //   propspec_file    : "tests/unit/hive/" + testname + "/inputs/good-list-multi-propspec.json",
        //   data_file        : "tests/unit/hive/" + testname + "/inputs/good-list-multi.json",
        //   expected_file     : "tests/unit/hive/" + testname + "/inputs/good-list-multi-expected.json"
        // },

        // {
        //   propspec_file    : "tests/unit/hive/" + testname + "/inputs/good-string-multi-propspec.json",
        //   data_file        : "tests/unit/hive/" + testname + "/inputs/good-string-multi.json",
        //   expected_file     : "tests/unit/hive/" + testname + "/inputs/good-string-multi-expected.json"
        // },

        // {
        //   propspec_file:  "tests/unit/hive/" + testname + "/inputs/good-heptagon-missing-id-propspec.json",
        //   data_file:      "tests/unit/hive/" + testname + "/inputs/good-heptagon-missing-id.json",
        //   expected_file:  "tests/unit/hive/" + testname + "/inputs/good-heptagon-missing-id-expected.json",
        // },        

        // {
        //   propspec_file:  "tests/unit/hive/" + testname + "/inputs/good-heptagon-bad-id-propspec.json",
        //   data_file:      "tests/unit/hive/" + testname + "/inputs/good-heptagon-bad-id.json",
        //   expected_file:  "tests/unit/hive/" + testname + "/inputs/good-heptagon-bad-id-expected.json",
        // },        

      ];

      for ( var i = 0; i < tests.length; i++ ) {
        var test = tests[i];
        var expected = validator.util.jsonFileToData(test.expected_file);

        // SHOW TEST FILE
        util.log(test.data_file, "FgGreen");

        var propspec = validator.util.jsonFileToData(test.propspec_file);
        var attributes = propspec["_field"];
        var data = validator.util.jsonFileToData(test.data_file);
        // util.log(data, "FgRed");

        var depth = "";
        var errors = [];
        var actual = validator.validateAttributes( attributes, data, depth, errors );

        // logger.log("actual", actual);
        // logger.log("expected", expected);

        (actual).should.deep.equal(expected);
      }

    }); // it

  }); // describe

}


});
