// const button = require('../shared/utility-button');
const button = require('../../../../robotois-digital-io');
const wifiConfig = require('robotois-wifi-config');

const topic = 'superToi/shadow/update';

const stopAll = (client) => {
  const jsonState = {
    desired: {
      task: {
        running: false,
      },
      motors: {
        stop: true,
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

function apButton(client) {
  const but = button(26);

  but.addFunction((secs, ms) => (secs == 1 && ms >= 0 || secs >= 2), () => {
    // this.leds.allBlink(this.colors.error);
    // this.motors.motorsStop();
    stopAll(client);
    wifiConfig.startAP('ChizentWiFi', 'ch1z3nt4p');
    console.log('[SuperToi] -> Enable Access Point...');
  })
}

module.exports = apButton;
