const { round } = require('../shared/shared');

let myTopic;
const tempReference = 25;
let prevValue = -1;
let mqttClient;

const init = (client, topic = 'shadow/sensors') => {
  mqttClient = client;
  myTopic = topic;
};

const publishValue = (value) =>
  mqttClient.publish(
    `${myTopic}/update`,
    JSON.stringify({
      reported: {
        sensors: {
          temp: value,
        }
      }
    }),
    { qos: 1 });

const getValue = () => {
  const value = (Math.random() * 1 - 0.5) + tempReference;
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
