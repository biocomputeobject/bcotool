var express = require('express');
var http = require('http');

// Create a service (the app object is just a callback).
var app = express();
var hourMs = 1000*60*60;


app.use(express.static("./", { maxAge: hourMs }));

function secureStatic(secure) {
  return function (req, res, next) {
    if (/^\/conf/.test(req.path) === !!conf) return statics(req, res, next);

    return next();
  };
}

app.use(secureStatic);

//app.use([/^\/conf($|\/)/, '/'], __dirname + './');

/* serve all the static files */
app.get(/^(.+)$/, function(request, response){
  console.log('app.get     request.params[0]: ' + request.params[0]);
  var match = request.params[0].match(/^\/*conf/);
  console.log('app.get     match: ' + match);
  
  if ( match ) {
    console.log('app.get    404 forbidden file request: ' + request.params[0]);
    return response.send("app.get    404 forbiddenxxx");
  }
  else {
    console.log('app.get    Sending file    request.params[0]: ' + request.params[0]);
    // response.sendFile( "./" + request.params[0]);
  }
});

// Create an HTTP service.
console.log("DOING http.createServer(app).listen(8080)");
http.createServer(app).listen(8080);

