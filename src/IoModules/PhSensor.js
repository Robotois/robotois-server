const { round } = require('../shared/shared');

let myTopic;
const phReference = 7;
let prevValue = -1;
let mqttClient;

const init = (client, topic = 'shadow') => {
  mqttClient = client;
  myTopic = topic;
};

const publishValue = (value) =>
  mqttClient.publish(
    `${myTopic}/update`,
    JSON.stringify({
      reported: {
        sensors: {
          ph: value,
        }
      }
    }),
    { qos: 1 });

const getValue = () => {
  const value = (Math.random() * 0.5 - 0.25) + phReference;
  const roundedValue = round(value, 1);
  if (roundedValue !== prevValue) {
    publishValue(roundedValue);
    prevValue = roundedValue
  } else {
    // console.log('same ph value:', roundedValue);
  }
  return value;
};

exports.getValue = getValue;
exports.init = init;
