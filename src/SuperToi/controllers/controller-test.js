let phValue = 7;
let inc = 1;
let interval = false;

module.exports = function controllerTest() {
  const jsonState = {
    desired: {
      task: {
        running: true,
        phValue: phValue,
      },
    },
  };
  interval = setInterval(() => {
    jsonState.desired.task.phValue = phValue;
    this.statePublisher(JSON.stringify(jsonState));
    if(phValue >= 9) {
      inc = -1;
    }
    if (phValue <= 4) {
      inc = 1;
    }
    phValue += inc;
  }, 30000);

  setTimeout(() => {
    clearInterval(interval);
    interval = false;
  }, 60000 * 5);
}
