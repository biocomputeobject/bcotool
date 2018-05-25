var host = process.env.IP ? process.env.IP + ':' + process.env.PORT : "localhost:8000";

module.exports = {
  info: { 
    title: 'Docker Repository',   // required
    version: '1.0.0',             // required
    description: 'A sample API',  // optional
  },
  host: host,                     // optional
  basePath: '/',                  // optional
};
