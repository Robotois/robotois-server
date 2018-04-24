const { round } = require('../shared/shared');

let myTopic;
let myInstance;
const motorReference = 35;
let prevValue = -1;
let mqttClient;

const init = (client, instance = "motor", topic = 'shadow/sensors') => {
  mqttClient = client;
  myTopic = topic;
  myInstance = instance;
};

const publishValue = (value) =>
  mqttClient.publish(
    `${myTopic}/update`,
    JSON.stringify({
      reported: {
        motors: {
          [myInstance]: value,
        }
      }
    }),
    { qos: 1 });

const getValue = () => {
  const value = (Math.random() * 10 - 5) + motorReference;
  const roundedValue = round(value, 1);
  if (roundedValue !== prevValue) {
    publishValue(roundedValue);
    prevValue = roundedValue
  } else {
    // console.log('same temp value:', roundedValue);
  }
  return value;
};

exports.getValue = getValue;
exports.init = init;
