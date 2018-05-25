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

  describe("checkfields", function () {
    it("should recursively validate fields in the data_object and its children", function () {

    var testname = "checkfields";
    var tests = [
      {
        propspec_file:  "data/hive/svc-profiler-heptagon-propspec.json",
        data_key:       "system",
        data_file:      "tests/unit/hive/" + testname + "/inputs/good-heptagon.json",
        expected_file:  "tests/unit/hive/" + testname + "/inputs/good-heptagon-expected.json",
      },
      {
        propspec_file:  "data/hive/svc-profiler-heptagon-propspec.json",
        data_key:       "",
        data_file:      "tests/unit/hive/" + testname + "/inputs/bad-heptagon-unknown-field.json",
        expected_file:  "tests/unit/hive/" + testname + "/inputs/bad-heptagon-unknown-field-expected.json",
      },
      {
        propspec_file:  "data/hive/svc-profiler-heptagon-propspec.json",
        data_key:       "",
        data_file:      "tests/unit/hive/" + testname + "/inputs/bad-heptagon-scalar-multi.json",
        expected_file:  "tests/unit/hive/" + testname + "/inputs/bad-heptagon-scalar-multi-expected.json",
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
        var attributes = definition["_field"];
        var depth = data_key;
        var errors = [];

        var actual = validator.checkFields( attributes, data_object, depth, errors );
        // console.log("actual", actual);
        // console.log("expected", expected);
        (actual).should.deep.equal(expected);
      }

    }); // it

  }); // describe

}


});
