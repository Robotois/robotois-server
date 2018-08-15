const mqtt = require('mqtt');

const PSensor = require('../../../robotois-as-ph-sensor');
const TSensor = require('../../../robotois-as-temperature-sensor');
const Motors = require('../../../robotois-motor-controller');
const LEDStrip = require('../../../robotois-ws2811');
const proccesor = require('./messageProcessor');
const pidController = require('./controllers/pid-control');
const fuzzyController = require('./controllers/fuzzy-control');
const controllerTest = require('./controllers/controller-test');

const getClient = () => new Promise((resolve, reject) => {
  const client = mqtt.connect({ host: 'localhost', port: 1883});
  client.on('connect', () => {
    resolve(client);
  });
});

function stopController() {
  this.motors.motorsStop();
  this.controller = {
    running: false,
  };
  this.leds.allOn(this.colors.primary);
}

function startMonitor() {
  this.phSensor.enableMonitor();
  this.tempSensor.enableMonitor();
}

function disableMonitor() {
  this.phSensor.disableMonitor();
  this.tempSensor.disableMonitor();
}

function motorTest() {
  let stringMessage;
  // stringMessage = JSON.stringify({
  //   desired: {
  //     motors: {
  //       motor1: 40,
  //       motor2: 30,
  //     }
  //   }
  // });
  // this.statePublisher(stringMessage);
  //
  // setTimeout(() => {
  //   this.stopAll()
  // }, 10000);
  setInterval(() => {
    stringMessage = JSON.stringify({
      desired: {
        motors: {
          motor1: Math.floor(Math.random() * 40),
          motor2: Math.floor(Math.random() * 40),
        }
      }
    });
    this.statePublisher(stringMessage);
  }, 3000);
}

function subscriber() {
  this.client.subscribe(this.topic);
  this.client.on('message', this.messageProcessor.bind(this));
}

function stopAll() {
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
  this.statePublisher(JSON.stringify(jsonState));
  console.log(`[SuperToi] -> Stop all tasks`);
}

function release() {
  this.motors.release();
  this.stopAll();
  this.leds.allOff();
  this.phSensor.disableMonitor();
  this.tempSensor.disableMonitor();
}

function statePublisher(jsonState) {
  this.client.publish(this.topic, jsonState);
}

const initializer = () => new Promise(async (resolve, reject) => {
  const topic = 'superToi/shadow/update';
  const client = await getClient();
  const phSensor = PSensor({ client, topic });
  const tempSensor = TSensor({ client, topic });
  const motors = Motors({ client, topic });
  const leds = new LEDStrip(3, 1, 128, 2);
  const colors = {
    primary: '#00d1b2',
    link: '#3273dc',
    info: '#209cee',
    success: '#23d160',
    warning: '#ffdd57',
    error: '#ff3860',
  };

  const obj = Object.create({
    subscriber,
    statePublisher,

    startMonitor,
    disableMonitor,

    ...proccesor,
    pidController,
    fuzzyController,
    stopController,

    controllerTest,
    motorTest,

    stopAll,
    release,
    leds,
    colors,
    controller: {},
  });

  const newObj = Object.assign(obj, {
    topic,
    client,
    phSensor,
    tempSensor,
    motors
  });
  newObj.subscriber();
  newObj.leds.allOn(colors.success);
  resolve(newObj);
});

let superToi;

function runer() {
  initializer()
  .then((sToi) => {
    superToi = sToi;
    superToi.startMonitor();
    // superToi.motorTest();
  });
}

process.on('SIGINT', () => {
  superToi.release();
  process.exit();
});

process.on('SIGTERM', () => {
  superToi.release();
  process.exit();
});

runer();

module.exports = initializer;
