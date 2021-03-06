const shadowUpdater = require('./update');

let updater;
let myBroker;
let currentState = {
  superToi: {
    reported: {
      sensors: {
        ph: 0,
        temp: 0,
      },
      motors: {
        acidPump: 0,
        basePump: 0,
      },
    },
    desired: {
      tasks: {
        control: {
          running: false,
          phValue: 7,
          tempValue: 20,
        }
      }
    }
  },
};

const updateReducer = (state, action) => {
  switch (true) {
    case action.reported !== undefined:
      return updater.reported(state, action);
    case action.desired !== undefined:
      return updater.desired(state, action);
    default:
      return state;
  }
};

const mainReducer = (state = {}, action) => {
  switch (true) {
    case action.topic.endsWith('shadow/update'):
      return updateReducer(state, action);
    case action.topic.endsWith('shadow/get'):
      myBroker.publish({
            topic: `${action.topic}/accepted`,
            payload: JSON.stringify(state),
            qos: 1,
          });
      return state;
    default:
      return state;
  }
};

const messageProcessor = (topic, message) => {
  // console.log(topic, message.toString());
  let jsonState = {};
  try {
    jsonState = JSON.parse(message);
  } catch (e) {
    console.log('JSON parse error:', e);
    return;
  }
  // const jsonState = JSON.parse(message);
  const action = {
    topic,
    ...jsonState,
  };
  const deviceName = topic.split('/')[0];
  currentState[deviceName] = mainReducer(currentState[deviceName], action)
  // console.log('updatedState:', currentState[deviceName]);
};

const init = (broker) => {
  myBroker = broker
  updater = shadowUpdater(broker);
  // fired when a message is received
  myBroker.on('published', function(packet, client) {
    // console.log(client ? client.id : '*', packet.topic, packet.payload.toString());
    if (client !== undefined && packet.topic.includes('shadow')) {
      messageProcessor(packet.topic, packet.payload.toString());
    }
  });
};

module.exports = init;
