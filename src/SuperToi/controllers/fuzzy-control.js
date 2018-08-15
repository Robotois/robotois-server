const getDoser = require('../../../../robotois-controller');

function constrain(value, min, max) {
  if(value < min){
    return min;
  }
  if(value > max){
    return max;
  }
  return value;
}

module.exports = function startFuzzy(duration) {
  let iter = 0;
  let timeout = false;
  this.controller.running = true;
  // if(duration) {
  //   setTimeout(() => {
  //     timeout = true;
  //     this.controller.running = false;
  //   }, 60000*duration);
  // }

  let phReading;
  let error, prevError = 0, errorChange = 0;
  let maxPWM = 50, alkPWM = 0, acidPWM = 0;
  let doserRate = 0;

  function run() {
    if(timeout || !this.controller.running) {
      return;
    }
    if(iter % 15 === 0) {
      const temp = this.tempSensor.read();
      if(temp !== -100) {
        this.phSensor.tempCompensation(temp);
      }
      iter = 0;
    }
    phReading = this.phSensor.read();

    error = phReading - this.controller.phValue;
    errorChange = error - prevError;
    prevError = error;

    // Fuzzy control
    doserRate = doserRate + getDoser({ error, errorChange })*20;
    doserRate = constrain(doserRate, -maxPWM, maxPWM);

    console.log('phReading:', phReading, 'Error:', error, 'doserRate:', doserRate);

    switch (true) {
      case doserRate === 0:
        alkPWM = 0;
        acidPWM = 0
        break;
      case doserRate < 0.0 && doserRate <= 15:
        alkPWM = doserRate;
        acidPWM = 0;
        break;
      case doserRate > 0.0 && doserRate >= 15:
        acidPWM = -doserRate;
        alkPWM = 0;
        break;
      default:
        alkPWM = 0;
        acidPWM = 0
    }
    this.motors.motorsPWM(acidPWM, alkPWM);

    iter = iter+1;
    setImmediate(run.bind(this));
  }
  setImmediate(run.bind(this));
}
