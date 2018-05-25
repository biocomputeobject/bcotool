'use strict'

module.exports = function plugin () {
  var seneca = this;
  var querystring = "";
  var seneca2 = require('seneca')({
    log: "silent"
  });
  var client = seneca2
  .client(
    { 
      type: "http",
      port: 8000,
      host: "localhost",
      protocol: "http",
      timeout:99999 
    }
  );
  // console.log("AFTER seneca.client");

  seneca.add('role:image,cmd:add', (msg, done) => {
    console.log("plugin    /image/add    msg: " + msg);

    seneca2.act({role: 'image', cmd: 'add', querystring: querystring}, function (err, result) {
      if (err) {
        console.log("ERROR");
        return console.error(err)
      }
      console.log("plugin.add    result", result)

      done(null, result)
    })
  })

  seneca.add('role:image,cmd:delete', (msg, done) => {
    console.log("plugin    /image/delete    msg: " + msg);

    seneca2.act({role: 'image', cmd: 'delete', querystring: querystring}, function (err, result) {
      if (err) {
        console.log("ERROR");
        return console.error(err)
      }
      console.log("plugin.delete    result", result)

      done(null, result)
    })
  })

  seneca.add('role:image,cmd:find', (msg, done) => {
    console.log("plugin    /image/find    msg: " + msg);

    seneca2.act({role: 'image', cmd: 'find', querystring: querystring}, function (err, result) {
      if (err) {
        console.log("ERROR");
        return console.error(err)
      }
      console.log("plugin.find    result", result)

      done(null, result)
    })
  })


}
