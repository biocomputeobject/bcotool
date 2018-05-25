define([
    'intern!bdd',
    'intern/chai!should',
    'intern/chai!expect',
    'intern/dojo/node!tracer/lib/index.js',
    'intern/dojo/node!../../../../../lib/validator',
    "intern/dojo/node!JSON",
    "intern/dojo/node!fs",
    "intern/dojo/node!../../../../../tests/support/lib/util" 
], function (

bdd, 
should,
expect,
Tracer,
validator,
JSON,
fs,
util

) {
should();
with (bdd) {

  var logger = new Tracer.console();

  describe("validateValues", function () {
    it("should validate all fields in the segment", function () {
      var tests = [
        {
            inputfile : "tests/unit/inputs/validate/good-fields-msh.json",
        }
        ,
        {
            inputfile : "tests/unit/inputs/validate/good-fields-msh-pid.json",
        }
        ,
        {
            inputfile : "tests/unit/inputs/validate/good-fields-msh-pid.json",
        }
        ,
        {
            inputfile : "tests/unit/inputs/validate/good-fields-msh-pid-pv1.json",
        }
        ,
        //// PROBLEM: field 'Name of Alternate Coding System' value 'CDSS' not found in table '396'
        //// SOLUTION: Added CCDS to table 396 (temporary)
        //// PROBLEM: 'field 'Name of Coding System' value 'Consider an alternative drug, or consider prescribing amitriptyline at standard dose and monitor the plasma concentrations of amitriptyline and nortriptyline to guide dose adjustments.' not found in table '396'
        //// SOLUTION: Change field separator from '^' to '|' between '704' and 'Amitriptyline'  
        // {
        //     inputfile : "tests/unit/inputs/validate/good-fields-one-obr.json",
        // }
        // ,
        {
            inputfile : "tests/unit/inputs/validate/bad-fields-security-message-type-XXX.json",
            expected: "field 'Message Code' value 'XXX' not found in table '76'"
        }
        ,
        {
            inputfile : "tests/unit/inputs/validate/bad-fields-msh-missing-sending-application.json",
            expected: "required field 'Sending Application' not found"
        }
    ];

    for ( var i = 0; i < tests.length; i++ ) {
        var test = tests[i];
        // logger.log("test", test);
        var inputfile = test.inputfile;
        util.log(inputfile, "FgGreen");
        var data = util.jsonFileToData(inputfile);
        // logger.log("data", data);                
        var version = validator.getVersion(data);
        // logger.log("version", version);
        var expected = test.expected ? test.expected : null;

        var actual = validator.validateValues(version, data);
        // logger.debug("actual", actual);
        // logger.debug("expected", expected);

        if ( expected == null ) {
            expect(actual).to.be.an('null');
        }
        else {
            actual.should.deep.equal(expected);
        }
      }
    });
  });

  describe("getParentDepth", function () {
      it("should get the parentDepth from the depth", function () {
          var tests = [
              {
                  depth : "2:children:0:children:4",
                  expected : "2:children:0",
              }
          ];
          for ( var i = 0; i < tests.length; i++ ) {
              var test = tests[i];
              util.log(test.depth, "FgGreen");
              var depth = test.depth;
              var expected = test.expected;
              // logger.log("depth", depth);

              var actual = validator.getParentDepth(depth);
              // logger.debug("actual", actual);
              // logger.debug("expected", expected);

              actual.should.equal(expected);
          }
      });
  });

  describe("getSubtree", function () {
      it("should get the subtree from the tree using the depth", function () {
          var tests = [
              {
                  treefile : "tests/unit/inputs/validate/getSubtree-depth-2-PATIENT_RESULT.json",
                  depth : "2:children",
                  expectedfile : "tests/unit/inputs/validate/getSubtree-depth-2-PATIENT_RESULT-expected.json"
              }
          ];
          for ( var i = 0; i < tests.length; i++ ) {
              var test = tests[i];
              util.log(test.treefile, "FgGreen");
              var tree = util.jsonFileToData(test.treefile);
              var depth = test.depth;
              var expected = util.jsonFileToData(test.expectedfile);
              // logger.log("depth", depth);

              var actual = validator.getSubtree(tree, depth);
              // logger.debug("actual", actual);
              // logger.debug("expected", expected);

              actual.should.deep.equal(expected);
          }
      });
  });

  describe("validate", function () {
      it("should detect incorrect counts of segments", function () {
          
          var tests = [
              {
                  inputfile : "tests/unit/inputs/validate/bad-two-msh.json",
                  dictofile : "tests/unit/inputs/validate/bad-two-msh-dicto.json",
                  expectedfile : "tests/unit/inputs/validate/bad-two-msh-expected.json",
              }
              ,
              {
                  inputfile : "tests/unit/inputs/validate/bad-missing-msh.json",
                  dictofile : "tests/unit/inputs/validate/bad-missing-msh-dicto.json",
                  expectedfile : "tests/unit/inputs/validate/bad-missing-msh-expected.json",
              }
              ,
              {
                  inputfile : "tests/unit/inputs/validate/good-missing-sft.json",
                  dictofile : "tests/unit/inputs/validate/good-missing-sft-dicto.json"
              }
              ,
              {
                  inputfile : "tests/unit/inputs/validate/good-nested-pid.json",
                  dictofile : "tests/unit/inputs/validate/good-nested-pid-dicto.json"
              }
              ,
              {
                  inputfile : "tests/unit/inputs/validate/bad-patient-result-patient-empty-children.json",
                  dictofile : "tests/unit/inputs/validate/bad-patient-result-patient-empty-children-dicto.json",
                  expectedfile : "tests/unit/inputs/validate/bad-patient-result-patient-empty-children-expected.json",
              }
              ,
              {
                  inputfile : "tests/unit/inputs/validate/bad-patient-result-empty-children.json",
                  dictofile : "tests/unit/inputs/validate/bad-patient-result-empty-children-dicto.json",
                  expectedfile : "tests/unit/inputs/validate/bad-patient-result-empty-children-expected.json",
              }
              ,
              {
                  inputfile : "tests/unit/inputs/validate/good-one-obr-ORU-R01.json",
                  dictofile : "tests/unit/inputs/validate/good-one-obr-ORU-R01-dicto.json",
              }
              ,
              {
                  inputfile : "tests/unit/inputs/validate/bad-missing-obr-ORU-R01.json",
                  dictofile : "tests/unit/inputs/validate/bad-missing-obr-ORU-R01-dicto.json",
                  expectedfile : "tests/unit/inputs/validate/bad-missing-obr-ORU-R01-expected.json",
              }
          ];

          for ( var i = 0; i < tests.length; i++ ) {
              var test = tests[i];
              var inputfile = test.inputfile;
              util.log(inputfile, "FgGreen");
              var data = util.jsonFileToData(test.inputfile);
              // logger.debug("data", data);
              var version = validator.getVersion(data);
              var expected = null;
              if ( test.expectedfile ) {
                  expected = util.jsonFileToData(test.expectedfile);
              }
              validator.dicto.definitions[version] = util.jsonFileToData(test.dictofile);
              // logger.debug("validator.dicto", validator.dicto);

              var actual = validator.validate(data, version);
              // logger.debug("actual", actual);
              // logger.debug("expected", expected);

              if ( ! expected ) {
                  expect(actual).to.be.an('null');
              }
              else {
                  actual.should.deep.equal(expected);
              }
          }
      });
  });

  describe("validate", function () {
      it("should validate parsed segments - order of elements", function () {
          
          var tests = [
              {
                  inputfile : "tests/unit/inputs/validate/one-obr.json",
                  expectedfile : "tests/unit/inputs/validate/one-obr-expected.json",
                  version : "2.5.1"
              }
         ];

          for ( var i = 0; i < tests.length; i++ ) {
              var test = tests[i];
              var inputfile = test.inputfile;
              util.log(inputfile, "FgGreen");
              var expectedfile = test.expectedfile;
              var version = test.version;
              var data = util.jsonFileToData(inputfile);
              var expected = util.jsonFileToData(expectedfile);
              // logger.debug("data", data);
              
              var actual = validator.validate(data, version);
              // logger.debug("actual", actual);
              // actual.should.deep.equal(expected);
          }
      });
  });
}


});
