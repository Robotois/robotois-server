function constrain(value, min, max) {
  if(value < min){
    return min;
  }
  if(value > max){
    return max;
  }
  return value;
}

module.exports = function pidController() {
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
  let currentError, prevError = 0;
  let maxPWM = this.controller.speed || 50, alkPWM = 0, acidPWM = 0;
  let doserRate = 0;
  let kp = 2, ki = 0.0001, kd = 5, integral = 0, rateChange = 0;
  // console.log('Starting PID Control, maxPWM:', maxPWM);

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

    currentError = phReading - this.controller.phValue;

    // PID control
    integral += currentError;
    rateChange = currentError*kp + integral*ki + (currentError - prevError)*kd;
    doserRate += rateChange;
    doserRate = constrain(doserRate, -maxPWM, maxPWM);

    prevError = currentError;
    // console.log('phReading:', phReading, 'PID Error:', currentError, 'doserRate:', doserRate, 'rateChange:', rateChange);

    switch (true) {
      case doserRate === 0:
        alkPWM = 0;
        acidPWM = 0
        break;
      case doserRate < 0.0 && doserRate <= -20:
        alkPWM = -doserRate;
        acidPWM = 0;
        break;
      case doserRate > 0.0 && doserRate >= 20:
        acidPWM = doserRate * 1.15;
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
