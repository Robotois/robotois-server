const mqtt = require('mqtt');
const phSensor = require('./PhSensor');
const tempSensor = require('./TempSensor');

const ioModules = {
  sensors: {
    ph: phSensor,
    temp: tempSensor,
  },
};

let client

const init = () => {
  client = mqtt.connect({ host: 'localhost', port: 1883, clientId: 'chizent-iot' });
  // client.subscribe('superToi/shadow/#', { qos: 1});

  ioModules.sensors.ph.init(client, 'superToi/shadow');
  ioModules.sensors.temp.init(client, 'superToi/shadow');

  setInterval(() => {
    ioModules.sensors.ph.getValue();
    ioModules.sensors.temp.getValue();
  }, 2000);
}

module.exports = init;
