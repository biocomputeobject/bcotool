// MAKE node-FORMAT MODULE LOOK LIKE AMD-FORMAT
var define;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function(require) {

/* External */
var JSON       = require('JSON');
const fs       = require('fs');
var q          = require('q');

/* Internal */
var logger     = require('../../../lib/utils/logger');

var remote = {

  file_path : null,

  /*
  * Mocks lib/utils/remote.js.
  * Returns content of file if no errors. 
  * Otherwise, returns an error hash.
  *
  * @param String method containing data to be validated
  * @param String id - ID of file (named '{id}.json')
  * @api public
  */
  fetch : function ( method, id ) {
    logger.log("id", id);
    logger.log("method", method);

    var deferred = q.defer();
    var thisObj = this;

    try {
      var file_path = thisObj.file_path + "/" + id + ".json";
      logger.log("file_path", file_path);
      var json = fs.readFileSync( file_path );
      // logger.log("json", json);
      var data = JSON.parse(json);
      // logger.log("data", data);
    
      deferred.resolve( data );
    }
    catch ( error ) {
      logger.error("error", error);
    }

    logger.log("Returning deferred promise", deferred.promise)
    return deferred.promise;
  }

}

return remote;

});

