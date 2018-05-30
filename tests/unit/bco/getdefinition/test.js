define([
    'intern!bdd',
    'intern/chai!should',
    'intern/chai!expect',
    'intern/dojo/node!tracer/lib/index.js',
    'intern/dojo/node!../../../../../../../lib/commands/bco',
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
bco,
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

  describe("getDefinition", function () {
    it("should get the definition for a data object", function () {

    var testname = "getdefinition";
    var definition_file = "data/spec.json";

    var tests = [
      {
        datatypefile:     "tests/unit/bco/" + testname + "/inputs/good-authors-array-orcid-only.json",
        expectedfile :    "tests/unit/bco/" + testname + "/inputs/good-authors-array-orcid-only-expected.json",
        name:             "authors"
      }
      ,
      {
        datatypefile :   "tests/unit/bco/" + testname + "/inputs/good-authors-array-id-etc.json",
        name:            "authors",    
        expectedfile :   "tests/unit/bco/" + testname + "/inputs/good-authors-array-id-etc-expected.json"
      }
      ,
      {
        datatypefile :   "tests/unit/bco/" + testname + "/inputs/good-authors-array-orcid-empty.json",
        name:            "authors",
        expectedfile :   "tests/unit/bco/" + testname + "/inputs/good-authors-array-orcid-empty-expected.json"
      }
    ];

    for ( var i = 0; i < tests.length; i++ ) {
      var test = tests[i];

      // SHOW TEST FILE
      util.log(test.datatypefile, "FgGreen");

      var expected    = commonUtil.jsonFileToData(test.expectedfile);
      var definitions = commonUtil.jsonFileToData(definition_file);
      var data_object = commonUtil.jsonFileToData(test.datatypefile);
      var name        = test.name;
      // logger.log("name", name);

      var actual = bco.getDefinition(definitions, data_object, definitions, data_object, name);
      // logger.log("actual", actual);
      // logger.log("expected", expected);

      (expected).should.deep.equal(actual);
    }

    }); // it

  }); // describe

}


});
