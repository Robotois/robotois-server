const mqtt = require('mqtt');
const stopButton = require('./stop-button');
const apButton = require('./ap-button');

const getClient = () => new Promise((resolve, reject) => {
  const client = mqtt.connect({ host: 'localhost', port: 1883});
  client.on('connect', () => {
    resolve(client);
  });
});

getClient().then((client) => {
  stopButton(client);
  apButton(client);
  console.log('[SuperToi] -> Buttons enabled');
})
