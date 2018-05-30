define([
    'intern!bdd',
    'intern/chai!should',
    'intern/chai!expect',
    'intern/dojo/node!tracer/lib/index.js',
    'intern/dojo/node!../../../../../../../lib/commands/bco',
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
JSON,
q,
fs,
async,
util

) {
should();
with (bdd) {

  var logger = new Tracer.console();

  describe("recursiveValidate", function () {
    it("should recursively validate a BCO file", function () {


    var delay = 500;
    var dfd = this.async(delay, null);
    var testname = "recursivevalidate";
    var tests = [
      {
        definition_files : [ 
          "tests/unit/bco/" + testname + "/inputs/bad-external-references-bco-spec.json" 
        ],
        data_file :     "tests/unit/bco/" + testname + "/inputs/bad-external-references.json",
        expectedfile :  "tests/unit/bco/" + testname + "/inputs/bad-external-references-expected.json"
      }
      ,
      {
        definition_files : [ 
          "data/datatypes.json",
          "data/spec.json"
        ],
        data_file :     "tests/unit/bco/" + testname + "/inputs/good-external-references.json",
        expectedfile :  "tests/unit/bco/" + testname + "/inputs/good-external-references-expected.json"
      }
      ,
      {
        definition_files : [ 
          "tests/unit/bco/" + testname + "/inputs/bad-external-references-bco-spec.json" 
        ],
        data_file :     "tests/unit/bco/" + testname + "/inputs/good-parametric-domain.json",
        expectedfile :  "tests/unit/bco/" + testname + "/inputs/good-parametric-domain-expected.json"
      }
      ,
      {
        definition_files : [ "data/spec.json" ],
        data_file :     "tests/unit/bco/" + testname + "/inputs/good-io-domain.json",
        expectedfile :  "tests/unit/bco/" + testname + "/inputs/good-io-domain-expected.json"
      }
      ,
      {
        definition_files : [ 
          "tests/unit/bco/" + testname + "/inputs/bad-io-domain-bco-spec.json" 
        ],
        data_file :     "tests/unit/bco/" + testname + "/inputs/bad-io-domain.json",
        expectedfile :  "tests/unit/bco/" + testname + "/inputs/bad-io-domain-expected.json"
      }
      ,
      {
        definition_files : [ 
          "data/datatypes.json",
          "data/spec.json"
        ],
        data_file :     "tests/unit/bco/" + testname + "/inputs/bad-unknown-domain.json",
        expectedfile :  "tests/unit/bco/" + testname + "/inputs/bad-unknown-domain-expected.json"
      }
      ,
      {
        definition_files : [ 
          "data/datatypes.json",
          "data/spec.json"
        ],
        data_file :     "tests/unit/bco/" + testname + "/inputs/bad-authors-not-found.json",
        expectedfile :  "tests/unit/bco/" + testname + "/inputs/bad-authors-not-found-expected.json"
      }
      ,
      {
        definition_files : [ 
          "data/datatypes.json",
          "data/spec.json"
        ],
        data_file :     "tests/unit/bco/" + testname + "/inputs/good-authors-found.json",
        expectedfile :     "tests/unit/bco/" + testname + "/inputs/good-authors-found-expected.json"
      }
      ,
      {
        definition_files : [ 
          "data/datatypes.json",
          "data/spec.json"
        ],
        data_file :     "tests/unit/bco/" + testname + "/inputs/good-authors-orcid-empty.json",
        expectedfile :  "tests/unit/bco/" + testname + "/inputs/good-authors-orcid-empty-expected.json"
      }
      ,
      {
        definition_files : [ 
          "data/datatypes.json",
          "data/spec.json"
        ],
        data_file :     "tests/unit/bco/" + testname + "/inputs/good-authors-orcid.json",
        expectedfile :  "tests/unit/bco/" + testname + "/inputs/good-authors-orcid-expected.json"
      }
      ,
      {
        definition_files : [ 
          "data/datatypes.json",
          "data/spec.json"
        ],
        data_file :     "tests/unit/bco/" + testname + "/inputs/good-error-domain.json",
        expectedfile :  "tests/unit/bco/" + testname + "/inputs/good-error-domain-expected.json"
      }
    ];

    for ( var i = 0; i < tests.length; i++ ) {
        var test = tests[i];

        // SHOW TEST FILE
        util.log(test.data_file, "FgGreen");

        var expected = validator.util.jsonFileToData(test.expectedfile);

        var promise = validator.validate(
          {
            data_file:        test.data_file,
            definition_files: test.definition_files
          } 
        );

        promise.then( function ( actual ) {
          // logger.log("actual", actual);
          // logger.log("expected", expected);

          if ( (expected).should.deep.equal(actual) ) {
            dfd.resolve(true);
            // deferred.resolve(true);
          }
          else {
            // deferred.resolve(false);
            dfd.resolve(false);
          }
        })
      }

      return dfd.promise;

    }); // it

  }); // describe

}


});

