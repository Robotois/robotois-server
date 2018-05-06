const { round } = require('../shared/shared');

function Motor({ client, topic, instance = 'motor' }) {
  this.client = client;
  this.topic = topic;
  this.speed = 0;
  this.instance = instance;
}
// Motor.prototype.initClient = function initClient() {
//   this.client.subscribe(this.topic, { qos: 1 });
//   // this.client.on('message', this.messageProcessor.bind(this));
//   this.write(0);
// };

Motor.prototype.setSpeed = function setSpeed(value) {
  this.speed = value !== undefined ? value : this.speed;
  if (this.client !== undefined) {
    const message = {
      reported: {
        motors: {
          [this.instance]: this.speed,
        }
      }
    };
    this.client.publish(this.topic, JSON.stringify(message), { qos: 1 });
  }
};

const motorCreator = ({ client, topic, instance }) => {
  const myMotor = new Motor({ client, topic, instance });
  // myMotor.initClient();
  return myMotor;
};

module.exports = motorCreator;
