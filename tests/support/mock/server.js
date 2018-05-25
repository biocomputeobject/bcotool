// MAKE node-FORMAT MODULE LOOK LIKE AMD-FORMAT
var define;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function(require) {

/* External */
var q          = require('q');
const fs       = require('fs');

/* Internal */
var logger     = require('../../../lib/utils/logger');

var server = {

  /*
  * Creates a server at a specified file path.
  * Returns server if no errors. 
  * Otherwise, returns an error hash.
  *
  * @param String data_file containing data to be validated
  * @param String definitions_file containing datatype definitions
  * @api public
  */

  create : function ( file_path, port ) {
    logger.log("file_path", file_path);
    logger.log("port", port);

    var deferred = q.defer();
    var thisObj = this;

    try {

      const http = require('http')

      const requestHandler = (request, response) => {
        // logger.log("request", request);
        logger.log("file_path", file_path);

        var fileStream = fs.createReadStream(file_path);
        fileStream.pipe(response);
        fileStream.on('open', function() {
          response.writeHead(200)
        })
        fileStream.on('error',function(e) {
          response.writeHead(404)     // assume the file doesn't exist
          response.end()
        })

        // response.end('Hello Node.js Server!')
      }

      const server = http.createServer(requestHandler)

      server.listen(port, (err) => {
        if (err) {
          return console.log('something bad happened', err)
        }
        else {
          logger.log("server is listening on port " + port);

          return deferred.resolve(server);
        }
      })

    }
    catch (err) {
      logger.log("err.message", err.message);
      if (err.stack) {
        logger.error(err.stack);
      }
      else {
        //logger.error("err " + "[" + err.lineNumber + "]", err);
        return deferred.resolve(result.stderr);
      }
    }

    logger.log("Returning deferred promise", deferred.promise)
    return deferred.promise;
  }

}


return server;

});

