const jsonParser = require('../shared/json-parser');
const mqtt = require('mqtt');
// const phSensor = require('./PhSensor');
// const tempSensor = require('./TempSensor');
const relay = require('./relay');

// const ioModules = {
//   sensors: {
//     ph: phSensor,
//     temp: tempSensor,
//   },
// };

let client;
let devices =  [];

const init = () => {
  client = mqtt.connect({ host: 'localhost', port: 1883, clientId: 'chizent-iot' });
  // client.subscribe('superToi/shadow/#', { qos: 1});
  client.on('connect', () => {
    devices.push({ id: 1, iguId: 'igu-1', device: relay({ client, topic: 'igu-1/shadow/update'})});
    devices.push({ id: 2, iguId: 'igu-2', device: relay({ client, topic: 'igu-2/shadow/update'})});
    devices.push({ id: 3, iguId: 'igu-3', device: relay({ client, topic: 'igu-3/shadow/update'})});
    devices.push({ id: 4, iguId: 'igu-4', device: relay({ client, topic: 'igu-4/shadow/update'})});
    devices.push({ id: 5, iguId: 'igu-5', device: relay({ client, topic: 'igu-5/shadow/update'})});
    devices.push({ id: 6, iguId: 'igu-6', device: relay({ client, topic: 'igu-6/shadow/update'})});
    devices.push({ id: 7, iguId: 'igu-7', device: relay({ client, topic: 'igu-7/shadow/update'})});
    devices.push({ id: 8, iguId: 'igu-8', device: relay({ client, topic: 'igu-8/shadow/update'})});
    devices.push({ id: 9, iguId: 'igu-9', device: relay({ client, topic: 'igu-9/shadow/update'})});
    devices.push({ id: 10, iguId: 'igu-10', device: relay({ client, topic: 'igu-10/shadow/update'})});
    devices.push({ id: 11, iguId: 'igu-11', device: relay({ client, topic: 'igu-11/shadow/update'})});
    devices.push({ id: 12, iguId: 'igu-12', device: relay({ client, topic: 'igu-12/shadow/update'})});
    client.on('message', (topic, message) => {
      const iguId = topic.split('/')[0];
      const device = devices.find(dev => dev.iguId === iguId);
      // console.log('deviceFound:', device)
      if (device) {
        const jsonState = jsonParser(message);
        device.device.messageProcessor(topic, jsonState)
      }
    });
    // ioModules.sensors.ph.init(client, 'superToi/shadow');
    // ioModules.sensors.temp.init(client, 'superToi/shadow');
    // sw1 = relay({ client, topic: 'switch1/shadow/update'});
    // setInterval(() => {
    //   ioModules.sensors.ph.getValue();
    //   ioModules.sensors.temp.getValue();
    //   sw1.toggle();
    // }, 2000);
  })
}

module.exports = init;
