#!/usr/bin/env node
'use strict';

// MAKE node-FORMAT MODULE LOOK LIKE AMD-FORMAT
var define;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function(require) {

var logger = require("tracer").colorConsole(
  {
    format : [
        "{{timestamp}} [{{file}}:{{line}}] {{method}} {{message}}", //default format
      {
        error : "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}" // error format
      }
  ],
    dateformat : "HH:MM:ss.L",
    preprocess :  function(data){
      data.title = data.title.toUpperCase();
    }
  }
);

return logger;

});
