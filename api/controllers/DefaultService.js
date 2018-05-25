'use strict';

exports.queryGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * database (Double)
  * version (Double)
  * terms (List)
  **/
  
  
  var examples = {};
  examples['application/json'] = [ {
  "single" : true,
  "name" : "aeiou"
} ];
  
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
  
}

