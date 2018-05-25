var mongoose = require('mongoose');

var schema = mongoose.Schema(
  {}, 
  { strict: false } 
);

module.exports = mongoose.model('DataModel', schema); 

