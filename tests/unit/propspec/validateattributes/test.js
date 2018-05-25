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

      var delay = 500;
      var dfd = this.async(delay, null);
      var testname = "validateattributes";
      var definition_files = [ 
        "data/bco/core.json",
        "data/bco/datatypes.json" 
      ];
      var tests = [
        {
          attributes_file: "data/hive/attributes.json",
          data_file : "tests/unit/propspec/" + testname + "/inputs/good-heptagon-propspec-one-attribute.json",
          expected_file : "tests/unit/propspec/" + testname + "/inputs/good-heptagon-propspec-one-attribute-expected.json"
        },
        {
          attributes_file: "data/hive/attributes.json",
          data_file : "tests/unit/propspec/" + testname + "/inputs/good-heptagon-propspec-multi-attribute.json",
          expected_file : "tests/unit/propspec/" + testname + "/inputs/good-heptagon-propspec-multi-attribute-expected.json"
        },
        {
          attributes_file: "data/hive/attributes.json",
          data_file : "tests/unit/propspec/" + testname + "/inputs/good-heptagon-propspec-nested-batch.json",
          expected_file : "tests/unit/propspec/" + testname + "/inputs/good-heptagon-propspec-nested-batch-expected.json"
        },
        {
          attributes_file: "data/hive/attributes.json",
          data_file : "tests/unit/propspec/" + testname + "/inputs/bad-heptagon-propspec-one-attribute.json",
          expected_file : "tests/unit/propspec/" + testname + "/inputs/bad-heptagon-propspec-one-attribute-expected.json"
        },
        {
          attributes_file   : "data/hive/attributes.json",
          data_file        : "tests/unit/propspec/" + testname + "/inputs/bad-heptagon-propspec-unknown-field.json",
          expected_file     : "tests/unit/propspec/" + testname + "/inputs/bad-heptagon-propspec-unknown-field-expected.json"
        }
        ,
        {
          attributes_file   : "data/hive/attributes.json",
          data_file        : "tests/unit/propspec/" + testname + "/inputs/good-heptagon-propspec-nested-children-twice.json",
          expected_file     : "tests/unit/propspec/" + testname + "/inputs/good-heptagon-propspec-nested-children-twice-expected.json"
        }
        ,
        {
          attributes_file   : "data/hive/attributes.json",
          data_file        : "tests/unit/propspec/" + testname + "/inputs/bad-heptagon-propspec-nested-twice-missing-required.json",
          expected_file     : "tests/unit/propspec/" + testname + "/inputs/bad-heptagon-propspec-nested-twice-missing-required-expected.json"
        }
      ];

      for ( var i = 0; i < tests.length; i++ ) {
        var test = tests[i];
        var expected = validator.util.jsonFileToData(test.expected_file);

        // SHOW TEST FILE
        util.log(test.data_file, "FgGreen");

        var attributes = validator.util.jsonFileToData(test.attributes_file);
        var data = validator.util.jsonFileToData(test.data_file);
        // util.log(data, "FgRed");

        var depth = "";
        var errors = [];
        var actual = validator.validateAttributes( attributes, data["_attributes"], depth, errors );

        // logger.log("actual", actual);
        // logger.log("expected", expected);

        var success = true;
        if ( (expected).should.deep.equal(actual) ) {
          // DO NOTHING
        }
        else {
          success = false;
        }
      }

      if ( success == true ) {
        dfd.resolve(true);
      }
      else {
        dfd.resolve(false);
      }

      return dfd.promise;

    }); // it

  }); // describe

}


});
