// const Express = require('express');
// const logger = require('morgan');
const mosca = require('mosca')
const redis = require('redis');

// const app = new Express();
// app.use(logger('tiny'));
// app.listen(8082, () => {
//   console.log('HTTP Server listening on port 8082');
// });

const ascoltatore = {
  type: 'redis',
  redis,
  db: 12,
  port: 6379,
  return_buffers: true, // to handle binary payloads
  host: "localhost"
};

const moscaSettings = {
  port: 1883,
  http: {
    port: 1884,
    bundle: true,
    static: './'
  },
  backend: ascoltatore,
  persistence: {
    factory: mosca.persistence.Redis
  }
};

let server;

const init = () => new Promise((resolve, reject) => {
  server = new mosca.Server(moscaSettings);

  server.on('ready', () => {
    console.log('Mosca server is up and running')
    resolve(server);
  });

  server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
  });

  // // fired when a message is received
  // server.on('published', function(packet, client) {
  //   console.log('Published:', client ? client.id : undefined, packet.topic, packet.payload.toString());
  // });
});

module.exports = init;
