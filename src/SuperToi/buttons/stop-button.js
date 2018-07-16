// const button = require('../shared/utility-button');
const button = require('../../../../robotois-digital-io');
const command = require('../../shared/commands');

const topic = 'superToi/shadow/update';

const stopAll = (client) => {
  const jsonState = {
    desired: {
      task: {
        running: false,
      },
      motors: {
        motor1: 0,
        motor2: 0,
      }
    },
  };
  // const message = {
  //   topic: topic,
  //   payload: JSON.stringify(jsonState), // or a Buffer
  //   qos: 0, // 0, 1, or 2
  //   retain: false // or true
  // };
  client.publish(topic, JSON.stringify(jsonState));
  console.log(`[SuperToi] -> Stop all tasks`);
}

function stopButton(client) {
  const but = button(16);

  but.addFunction(() => true, () => {
    stopAll(client)
  });
  but.addFunction((secs, ms) => (secs == 1 && ms >= 500 || secs >= 2), (secs, ms) => {
    console.log(`[SuperToi] -> Shutdown...`);
    command('sudo shutdown -h now');
  })
}

module.exports = stopButton;
