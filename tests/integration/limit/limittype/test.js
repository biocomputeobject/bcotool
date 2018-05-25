define([
  'intern!bdd',
  'intern/chai!should',
  'intern/chai!expect',
  'intern/dojo/node!tracer/lib/index.js',
  'intern/dojo/node!../../../../../../../lib/commands/limit',
  'intern/dojo/node!../../../../../../../tests/support/mock/remote',
  'intern/dojo/node!../../../../../../../tests/support/mock/server',
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
remote,
server,
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

 describe("limittype", function () {

  it("should validate object type against remote server", function () {

    var delay = 500;
    var dfd = this.async(delay, null);
    var testname     = "limittype";
    var server_port  = 8080;
    var url          = "http://localhost:8080/";
    var commands     = {
      "objList": "cmd=objList&prop_name=_id&type=process%2B&raw=1&mode=json"
    };

    var file_path    = "tests/integration/limit/" + testname + "/inputs/remote/objlist";
    var tests = [

      // "type" - any object matching specified types; the constraint specification is a string containing a comma-separated list of regexps matching type names, each one optionally prefixed with ! to negate and/or suffixed with + indicating the type(s) matching the regexp or any of its (their) descendents; e.g. "^genome$+,folder" to match objects of type genome , or of any type descending from genome , or any type with folder as a substring in the name.

      {
        name: "parent_proc_ids",
        limit: {
          "type": "^svc-profiler$+"
        },
        value: {
          "24": 3153468
        },
        expected: []
      },

    ];

    for ( var i = 0; i < tests.length; i++ ) {
      var test = tests[i];
      var expected  = test.expected;
      var depth = "";
      var errors = [];

      // PROGRESS
      util.log(test.name + "   " + test.value + "  " + JSON.stringify(test.limit) + "    " + JSON.stringify(expected), "FgGreen");

      var id;
      for ( var key in test.value ) {
        id = test.value[key];
      }
      logger.log("id", id);

      // CREATE SERVER
      logger.log("Creating server");
      validator.remote.file_path = file_path;
      validator.remote.config = {
        url : url,
        commands : {
          objList : file_path  + "/" + id + ".json"
        }
      };

      server.create( file_path  + "/" + id + ".json", server_port )
      .then( function ( server ) {

        var promise = validator.limitType(
          test.limit, 
          test.value,
          depth,
          errors
        );
        logger.log("promise", promise);
        promise.then( function ( actual ) {

          logger.log("actual", actual);
          logger.log("expected", expected);

          if ( (expected).should.deep.equal(actual) ) {
            dfd.resolve(true);
          }
          else {
            dfd.resolve(false);
          }

          // CLOSE SERVER
          logger.log("BEFORE server.close()");
          server.close();
          logger.log("AFTER server.close()");

        });  

      })
      .catch ( function ( error ) {
        logger.log("error", error);
      });

    } // for loop

    return dfd.promise;

  }); // it

 }); // describe

}


});
