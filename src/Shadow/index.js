const updateReported = require('./update');
let myBroker;
let currentState;

const updateReducer = (state, action) => {
  switch (true) {
    case action.reported !== undefined:
      return updateReported(state, action.reported, myBroker);
    default:
      return state;
  }
};

const mainReducer = (state = {}, action) => {
  switch (action.topic) {
    case 'superToi/shadow/update':
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
  currentState = mainReducer(currentState, action)
};

const init = (broker) => {
  myBroker = broker
  // fired when a message is received
  myBroker.on('published', function(packet, client) {
    // console.log(client ? client.id : '*', packet.topic, packet.payload.toString());
    if (client !== undefined) {
      messageProcessor(packet.topic, packet.payload.toString());
    }
  });
};

module.exports = init;
