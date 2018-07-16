// const ioModules = require('./IoModules');
// const SuperToi = require('./SuperToi');

// const mqttBroker = require('./Broker');
// const shadowService = require('./Shadow');

require('./server');
const mqtt = require('mqtt');
const stopButton = require('./SuperToi/stop-button');
const apButton = require('./SuperToi/ap-button');

const getClient = () => new Promise((resolve, reject) => {
  const client = mqtt.connect({ host: 'localhost', port: 1883 });
  client.on('connect', () => {
    resolve(client);
  });
});

getClient().then((client) => {
  stopButton(client);
  apButton(client);
});

// mqttBroker().then((broker) => {
//   shadowService(broker);
//   stopButton(broker);
//   apButton(broker);
// });
