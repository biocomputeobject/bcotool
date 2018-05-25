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

  describe("validate", function () {
    it("should validate a datatype file", function () {

    var testname = "checkrequired";
    var tests = [
      // {
      //   propspec_file: "data/hive/svc-profiler-heptagon-propspec.json",
      //   data_file : "tests/unit/hive/" + testname + "/inputs/good-heptagon-raw.json",
      //   expected_file : "tests/unit/hive/" + testname + "/inputs/good-heptagon-raw-expected.json"
      // },
      {
        propspec_file: "data/hive/svc-align-hexagon-propspec.json",
        data_file : "tests/unit/hive/" + testname + "/inputs/good-hexagon-raw.json",
        expected_file : "tests/unit/hive/" + testname + "/inputs/good-hexagon-raw-expected.json"
      }
    ];

    for ( var i = 0; i < tests.length; i++ ) {
        var test = tests[i];

        var expected = validator.util.jsonFileToData(test.expected_file);

        // SHOW TEST FILE
        util.log(test.data_file, "FgGreen");

        var data_object = validator.util.jsonFileToData(test.data_file);
        var definition = validator.util.jsonFileToData(test.propspec_file);
        var attributes = definition["_field"];
        var depth = "";
        var errors = [];
        var actual = validator.checkRequired( attributes, data_object, depth, errors );

        (expected).should.deep.equal(actual);
      }

    }); // it

  }); // describe

}


});
