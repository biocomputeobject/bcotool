'use strict';

var url = require('url');


var Default = require('./DefaultService');


module.exports.queryGET = function queryGET (req, res, next) {
  Default.queryGET(req.swagger.params, res, next);
};
