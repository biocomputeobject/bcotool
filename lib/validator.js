// MAKE node-FORMAT MODULE LOOK LIKE AMD-FORMAT
var define;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}
define(function(require) {

var logger  = require('tracer').colorConsole({level:'log'});
var fs      = require('fs');
var path    = require('path');
var util    = require("../lib/util.js");
var q       = require('q');

var validator = {
  datatype:   require("../lib/commands/datatype"),
  bco:        require("../lib/commands/bco"),
  definition:  require("../lib/commands/delete"),
  // db:       require('../lib/db'),

  datatype : function (data) {
    return this.datatype.validate(data);
  },

  definition : function (data) {
    return this.definition.validate(data);
  },

  bco : function (data) {
    return this.bco.validate(data);
  },

};

return validator;

});




