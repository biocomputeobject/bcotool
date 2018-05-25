#!/usr/bin/env node

var program = require('../lib/utils/commander');

// USES SEPARATE EXECUTABLES FOR SUB-COMMANDS

program
  .version('0.0.1')
  .command('propspec [file]', 'Validate a HIVE data specification file')
  .command('hive [file]', 'Validate a HIVE object file')
  .command('datatype [file]', 'Validate a datatype definition file')
  .command('bco [file]', 'Validate a BCO file')
  .command('get [file]', 'Retrieve data object from JSON file based on bcotool error output')
  .parse(process.argv);
