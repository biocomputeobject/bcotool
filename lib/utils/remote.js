// MAKE node-FORMAT MODULE LOOK LIKE AMD-FORMAT
var define;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function(require) {

/* External */
// var fetch      = require('node-fetch');
var axios      = require('axios');
const fs       = require('fs');
var JSON       = require('JSON');
var q          = require('q');

/* Internal */
var logger     = require('./logger');
var util       = require("./util");
var config     = util.jsonFileToData(__dirname + "/../../conf/bco.config");
logger.log("config", config);

var remote = {

  config: config,

  /*
  * Makes calls to a remote HTTP server.
  * Returns HTTP server output if no errors. 
  * Otherwise, returns an error hash.
  *
  * @param String url location of HTTP(S) server.
  * @param String id - ID of HIVE object
  * @api public
  */
  fetch : function ( method, id ) {
    logger.log("method", method);
    logger.log("id", id);

    var url = this.config.url;
    var command = this.config.commands[method];
    url += command;
    url += "&prop_val=" + id;

    var deferred = q.defer();
    var thisObj = this;

    try {
      logger.log("BEFORE axios.get(url)");
      logger.log("url", url);
      axios.get(url)
      .then(function( response ) {
        deferred.resolve( response.data.objs );
      })
      .catch( function ( error ) {
        logger.error("error", error);
      });      
    }
    catch ( error ) {
      logger.log("error", error);
    }

    logger.log("Returning deferred promise", deferred.promise)
    return deferred.promise;
  }


}


return remote;

});

