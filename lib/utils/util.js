// MAKE node-FORMAT MODULE LOOK LIKE AMD-FORMAT
var define;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function(require) {

var logger = require('tracer');
var fs = require('fs');
var path = require('path');
var q = require('q');

var util = {

  formatResults : function ( message, results ) {
    // logger.log("message", message);
    // logger.log("results", results);

    if ( results.error && results.error != "" ) {
      return "\n\n" + results.error;
    }
    else {
      var output = "\n\n" + message;
      output += util.arrayToString(results.data);
      return output;
    }
  },

  arrayToString : function ( array ) {
    if ( ! array || ! array.length ) {
      return "";
    }
    // logger.log("array", array);
    // logger.log("array.length", array.length);
    var output = "";
    var i;
    for (var i = 0; i < array.length; i++) {
      var data = array[i];
      output += util.toString(data);
      output += "\n";
    }

    return output;  
  },

  toString : function ( data ) {
    // logger.log("data", data);
    var fields = [
      "imageid",
      "imagename",
      "containerid",
      "tag",
      "application",
      "version",
      "username",
      "desc",
      "notes"
    ];

    var output = "";
    var i;
    var maxlength = 15;
    for ( i = 0; i < fields.length; i++ ) {
      var key = fields[i];
      if ( data[key] && data[key] != "" ) {
        var value = data[key] || "";
        var spaces = maxlength - key.length;
        output += key;
        output += ' '.repeat(spaces);
        output += value + "\n";
      }
    }

    return output;
  },

  runCommand : function ( executable, arguments, options ) {
    var deferred = q.defer();
    // console.log("XXXXXXXXXXXXXXXXXXXX runCommand XXXXXXXXXXXXXXXXXXX");
    // logger.log("executable", executable);
    // logger.log("arguments", arguments);
    // logger.log("options", options);

    var spawn = require('child_process').spawn;
    var child = spawn(executable, arguments, options);
    var out = "";
    var err = "";
    child.stdout.on('data', function (chunk) {
      out += chunk;
    });

    child.stderr.on('data', function (chunk) {
      err += chunk;
    });

    child.on("exit", function (exitcode) {
      // logger.log("exitcode", exitcode);
      // logger.log("out", out);
      // logger.log("err", err);

      deferred.resolve({
        stdout: out,
        stderr: err
      });
    })

    return deferred.promise;
  },

  findIndex : function (array, entry) {
    for (var i = 0; i < array.length; i++) {
      if ( array[i] == entry ) {
        return i;
      }
    }

    return null;
  },

  hashKeysToArray: function (hash) {
    var array = [];
    for ( key in hash) {
      array.push(key);
    }

    return array;
  },

  arrayToHash : function (array) {
    var hash = {};
    for (var i = 0; i < array.length; i++) {
      hash[array[i]] = 1;
    }

    return hash;
  },

  arrayToOrderedHash : function (array) {
    var hash = {};
    for (var i = 0; i < array.length; i++) {
      hash[array[i]] = i;
    }

    return hash;
  },

  reverseHash : function (hash) {
    var reversed = {};
    for (var key in hash ) {
      reversed[hash[key]] = key;
    }

    return reversed;
  },

  printFile : function (file, contents) {
    // logger.log("file", file);
    fs.writeFileSync(file, contents); 
  },

  printBinaryFile : function (file, data) {
    fs.writeFile(file, data, 'binary');
  },

  /*
  * Return a copy of the input array
  *
  * @param {array} an array containing entries
  * @api private
  */
  copyArray : function (array) {
    var outputArray = []; 
    for (key in array) {
      outputArray.push(array[key]);
    }

    return outputArray;
  },

  /*
  * Return a copy of the input hash (associative array)
  *
  * @param {hash} associative array containing key-value pairs
  * @api private
  */
  copyHash : function (hash) {
    var outputHash = {}; 
    for (key in hash) {
      outputHash[key] = hash[key];
    }

    return outputHash;
  },

  /*
  * Adds key-value pairs from one hash to another
  * Overwrites key value pairs: 
  * The values in the first input hash will be overwritten with the values 
  * in the second input hash
  *
  * @param {hash1} associative array containing key-value pairs
  * @param {hash2} associative array containing key-value pairs
  * @api private
  */

  addHashes : function (hash1, hash2) {
    for (key in hash2) {
      hash1[key] = hash2[key];
    }

    return hash1;
  },

  mergeHashes : function ( hash1, hash2 ) {
   var hash = {};
    for (var key in hash1) { hash[key] = hash1[key]; }
    for (var key in hash2) { hash[key] = hash2[key]; }

    return hash;
  },

  fileContents : function (file) {
    if ( file == null || ! file ) {
      return null;
    }
    
    return fs.readFileSync(file).toString();
  },

  fileLines : function (file) {
    var contents = this.fileContents(file);
    if ( contents == null ) {
      return null;
    }

    return contents.split("\n");
  },

  fileContents : function (file) {
    if ( file == null || ! file ) {
      return null;
    }
    
    return fs.readFileSync(file).toString();
  },

  copyFile : function (infile, outfile) {
    // logger.log("infile", infile);
    // logger.log("outfile", outfile);
    var contents = fs.readFileSync(infile).toString();
    this.printFile(outfile, contents);
  },

  getDirs : function (directory) {
    return fs.readdirSync(directory).filter(function(file) {
      var filepath = directory + "/" + file;
      try {
        if ( fs.existsSync(filepath, fs.F_OK) ) {
          return fs.statSync(filepath).isDirectory();
        }
      }
      catch (error) {
        // logger.log("error", error);
      }
    });
  },

  getFiles : function (directory) {
    return fs.readdirSync(directory).filter(function(file) {
      var filepath = directory + "/" + file;
      try {
        if ( fs.existsSync(filepath, fs.F_OK) ) {
          return fs.statSync(filepath).isFile();
        }
      }
      catch (error) {
        // logger.log("error", error);
      }
    });
  },

  getFilesByPattern : function (directory, pattern) {
    var files = this.getFiles(directory);
    files = this.filterStrings(files, pattern);

    return files;
  },

  getDirsByPattern : function (directory, pattern) {
    var dirs = this.getDirs(directory);
    dirs = this.filterStrings(dirs, pattern);

    return dirs;
  },

  filterStrings : function (array, pattern) {
    var regex = new RegExp(pattern);
    
    var filtered = [];
    for (var i = 0; i < array.length; i++) {
      if (regex.test(array[i])) {
        filtered.push(array[i]);
      }
    };

    return filtered;
  },

  toJson : function (data) {
    return JSON.stringify(data);
  },

  jsonFileToData : function (inputfile) {
    // console.log("inputfile", inputfile);
    
    var json = fs.readFileSync(inputfile).toString();
    // logger.log("BEFORE json", json);

    // REMOVE /* ... */
    var pattern = /^\s*\/\*[\s\S]*?\*\//gm;
    json = json.replace(pattern, "");
    // console.log("AFTER pattern1 json", json);

    // REMOVE // ...
    var pattern2 = /^\s*\/\/[\s\S]*?\n/gm;
    json = json.replace(pattern2, "");
    // console.log("AFTER pattern2 json", json);

    // // REPLACE '/' WITH '\/'
    // var pattern3 = /\//gm;
    // json = json.replace(pattern3, "\/");
    // console.log("AFTER pattern3 json", json);

    var data = JSON.parse(json);

    return data;
  },

  diff : function (file1, file2) {
    // SANITY CHECKS  
    if ( ! file1 ) {
      // logger.log("File1 not defined. Returning null");
    }
    if ( ! file2 ) {
      // logger.log("File2 not defined. Returning null");
    }
    var isDir1 = fs.statSync(file1).isDirectory();
    var isDir2 = fs.statSync(file2).isDirectory();

    if ( (isDir1 && !isDir2) || (!isDir1 && isDir2) ) {
      if ( isDir1 ) {
        // logger.log("file1 is a directory, file2 is a file. Returning null");
        return null;
      }
      else {
        // logger.log("file2 is a directory, file1 is a file. Returning null");
        return null;
      }
    }

    // SET COMMAND
    var arguments = ["wb", file1, file2];
    if ( isDir1 ) {
      arguments = ["-r", file1, file2];
    }
    // logger.log("arguments", arguments);

    // RUN COMMAND
    var executable = "/usr/bin/diff";
    var spawn = require('child_process').spawn;
    var child = spawn(executable, arguments);

    child.stdout.on('data', function(chunk) {
      // output will be here in chunks
      // logger.log("STDOUT", chunk.toString());
      return 1;
    });

    child.stderr.on('data', function(chunk) {
      // output will be here in chunks
      return null;
      // logger.log("STDERR", chunk.toString());
    });
  
    return 0;
  }

};

return util;

});




