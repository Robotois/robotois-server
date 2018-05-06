const { round } = require('../shared/shared');

// const jsonParser = require('../shared/json-parser');
const mqtt = require('mqtt');
const phSensor = require('./PhSensor');
const tempSensor = require('./TempSensor');
const motor = require('./motors');
// const relay = require('./relay');

// const ioModules = {
//   sensors: {
//     ph: phSensor,
//     temp: tempSensor,
//   },
// };

let client;
let motor1;
let motor2;
let speed;
// let devices =  [];

const init = () => {
  client = mqtt.connect({ host: 'localhost', port: 1883, clientId: 'chizent-iot' });
  // client.subscribe('superToi/shadow/#', { qos: 1});
  client.on('connect', () => {
    // devices.push({ id: 1, iguId: 'igu-1', device: relay({ client, topic: 'igu-1/shadow/update'})});
    // devices.push({ id: 2, iguId: 'igu-2', device: relay({ client, topic: 'igu-2/shadow/update'})});
    // devices.push({ id: 3, iguId: 'igu-3', device: relay({ client, topic: 'igu-3/shadow/update'})});
    // devices.push({ id: 4, iguId: 'igu-4', device: relay({ client, topic: 'igu-4/shadow/update'})});
    // devices.push({ id: 5, iguId: 'igu-5', device: relay({ client, topic: 'igu-5/shadow/update'})});
    // devices.push({ id: 6, iguId: 'igu-6', device: relay({ client, topic: 'igu-6/shadow/update'})});
    // devices.push({ id: 7, iguId: 'igu-7', device: relay({ client, topic: 'igu-7/shadow/update'})});
    // devices.push({ id: 8, iguId: 'igu-8', device: relay({ client, topic: 'igu-8/shadow/update'})});
    // devices.push({ id: 9, iguId: 'igu-9', device: relay({ client, topic: 'igu-9/shadow/update'})});
    // devices.push({ id: 10, iguId: 'igu-10', device: relay({ client, topic: 'igu-10/shadow/update'})});
    // devices.push({ id: 11, iguId: 'igu-11', device: relay({ client, topic: 'igu-11/shadow/update'})});
    // devices.push({ id: 12, iguId: 'igu-12', device: relay({ client, topic: 'igu-12/shadow/update'})});
    // client.on('message', (topic, message) => {
    //   const iguId = topic.split('/')[0];
    //   const device = devices.find(dev => dev.iguId === iguId);
    //   // console.log('deviceFound:', device)
    //   if (device) {
    //     const jsonState = jsonParser(message);
    //     device.device.messageProcessor(topic, jsonState)
    //   }
    // });
    motor1 = motor({ client, topic: 'superToi/shadow/update', instance: 'motor1' })
    motor2 = motor({ client, topic: 'superToi/shadow/update', instance: 'motor2' })
    phSensor.init(client, 'superToi/shadow');
    tempSensor.init(client, 'superToi/shadow');
    setInterval(() => {
      phSensor.getValue();
      tempSensor.getValue();
      speed = (Math.random() * 10 - 0.25) + 35;
      motor1.setSpeed(round(speed, 1));
      speed = (Math.random() * 10 - 0.25) + 45;
      motor2.setSpeed(round(speed, 1));
    }, 3000);
  })
}

module.exports = init;
