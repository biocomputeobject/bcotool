/* Logger factory */

// MAKE node-FORMAT MODULE LOOK LIKE AMD-FORMAT
var define;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function(require) {

var logger = require('tracer').colorConsole({
  format : [
    // default format
    "{{timestamp}} {{file}} {{method}}:{{line}} {{message}}", 

    // special format for output
    // {
    //   error : "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}" // error format
    // }
  ],
  // dateformat : "HH:MM:ss.L",
  dateformat : "HH:MM:ss",
  preprocess :  function(data){
    data.method = data.method.replace(/^Object\./, '');
  },
  level:'log',
  inspectOpt: {
    showHidden : true,
    depth : null
  }
});

return logger;

});
