
// const Events = require('events');
const { Gpio } = require('onoff');
let hrstart;
let hrend;

function watcher() {
  this.button.watch((err, value) => {
    if(err) {
      console.error('[SuperToi] -> Button Error:', err);
      return;
    }
    if(value === 0 && hrstart === undefined) {
      hrstart = process.hrtime();
    }

    if(value === 1 && hrstart !== undefined) {
      hrend = process.hrtime(hrstart);
      const ms = (hrend[1] / 1000000);
      if (hrend[0] == 0 && ms > 25 || hrend[0] >= 1) {
        // console.info('Pressed time: %ds, %dms', hrend[0], ms);
        this.evalFunctions(hrend[0], ms);
        // this.emit('pressed', hrend[0], ms);
      }
      hrstart = undefined;
      hrend = undefined;
    }
  });
}

function evalFunctions(seconds, ms) {
  this.functions.map((fn) => {
    if (fn.condition(seconds, ms)) {
      fn.func(seconds, ms);
    }
    return 0;
  });
}

function addFunction(condition, func) {
  this.functions.push({
    condition,
    func,
  });
}

const init = (ioPin) => {
  const obj = Object.create({
    button: new Gpio(ioPin, 'in', 'both'),
    functions: [],
    addFunction,
    watcher,
    evalFunctions,
  });

  // const newObj = Object.assign(obj, Events.prototype);
  obj.watcher();
  return obj;
}

module.exports = init;

const test = () => {
  const but = init(16);
  but.addFunction((secs, ms) => (secs == 0 && ms >= 90 && ms <= 750), (secs, ms) => {
     console.log(`(${secs}, ${ms}) => [SuperToi] -> Stop all tasks`);
  })
  but.addFunction((secs, ms) => (secs == 1 && ms >= 500 || secs >= 2), (secs, ms) => {
     console.log(`(${secs}, ${ms}) => [SuperToi] -> Shutdown...`);
  })
}
// test();
