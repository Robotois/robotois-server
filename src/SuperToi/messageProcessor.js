const jsonParser = require('../shared/json-parser');

exports.calibrate = function calibrate(state) {
  if (!state.request) {
    return;
  }
  // console.log('Calibrate Request:', state);
  const message = {
    reported: {
      calibrate: {
        calPoint: state.calPoint,
        completed: true,
        request: false,
      }
    }
  };
  setTimeout(() => {
    this.phSensor.calibrate(state.calPoint);
    this.statePublisher(JSON.stringify(message));
  }, 15000);
}

exports.task = function task(state) {
  const isUpdate = this.controller.running === state.running;
  this.controller = { ...state };
  if(this.controller.running && !isUpdate) {
    this.leds.allOn(this.colors.warning);
  }

  console.log('Task:', state);
  const message = {
    reported: {
      task: {
        ...state,
      }
    }
  };
  this.statePublisher(JSON.stringify(message));
  switch (state.running) {
    case true:
      if (!isUpdate) {
        this.disableMonitor();
        this.pidController(state.phValue, state.speed);
        // this.fuzzyController(state.phValue, state.time);
      }
      break;
    case false:
      this.stopController();
      this.startMonitor();
      break;
    default:
  }
}

exports.updateMotors = function updateMotors(state) {
  console.log('MotorsUpdate: ', state);
  Object.keys(state).forEach((key) => {
    switch (key) {
      case 'motor1':
        this.motors.motor1PWM(state[key]);
        break;
      case 'motor2':
        this.motors.motor2PWM(state[key]);
        break;
      default:
    }
  });
}

exports.messageProcessor = function messageProcessor(topic, message) {
  // this.leds.allOn(this.colors.warning);
  const jsonState = jsonParser(message);
  const { desired } = jsonState;
  if (desired) {
    Object.keys(desired).map((key) => {
      switch (key) {
        case 'motors':
          // this.leds.allOn(this.colors.link);
          this.updateMotors(desired[key])
          break;
        case 'task':
          this.task(desired[key]);
          break;
        case 'calibrate':
            this.calibrate(desired[key]);
            break;
        default:
      }
    });
  }
  // this.leds.allOn(this.colors.primary);
}
