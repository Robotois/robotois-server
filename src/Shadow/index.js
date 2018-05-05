const shadowUpdater = require('./update');

let updater;
let myBroker;
let currentState = {};

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
    default:
      return state;
  }
}

const messageProcessor = (topic, message) => {
  // console.log(topic, message.toString());
  const jsonState = JSON.parse(message);
  const action = {
    topic,
    ...jsonState,
  };
  const deviceName = topic.split('/')[0];
  // console.log(deviceName);
  currentState[deviceName] = mainReducer(currentState[deviceName], action)
};

const init = (broker) => {
  myBroker = broker
  updater = shadowUpdater(broker);
  // fired when a message is received
  myBroker.on('published', function(packet, client) {
    console.log(client ? client.id : '*', packet.topic, packet.payload.toString());
    if (client !== undefined && packet.topic.includes('shadow')) {
      messageProcessor(packet.topic, packet.payload.toString());
    }
  });
};

module.exports = init;
