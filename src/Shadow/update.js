const moment = require('moment');

const buildMeta = (reported) => Object.keys(reported)
  .reduce(
    (result, key) => ({
      ...result,
      [key]: moment().utcOffset(-5)
    }),
    {}
  );

const updateState = (state, newState, updateType) => {
  const meta = Object.keys(newState).reduce(
    (result, category) => ({
      ...result,
      [category]: buildMeta(newState[category])
    }),
    {}
  );
  const newMeta = { [updateType]: { ...meta } };
  const acceptedState = {
    [updateType]: { ...newState },
    metadata: newMeta,
  };
  const updatedState = {
    ...state,
    [updateType]: {
      ...state[updateType],
      ...newState,
    },
    metadata: {
      ...state.metadata,
      ...newMeta
    }
  };
  return {
    acceptedState,
    updatedState
  };
};

const updater = {
  publishAccepted(topic, state) {
    this.broker.publish({
      topic: `${topic}/accepted`,
      payload: JSON.stringify(state),
      qos: 1,
    });
  },
  reported(state, { reported, topic }) {
    const { acceptedState, updatedState } = updateState(state, reported, 'reported');
    this.publishAccepted(topic, acceptedState);
    return updatedState;
  },
  desired(state, { desired, topic }) {
    const { acceptedState, updatedState } = updateState(state, desired, 'desired');
    this.publishAccepted(topic, acceptedState);
    return updatedState;
  },
}

const creator = (broker) => {
  return Object.assign(Object.create(updater), { broker });
}

module.exports = creator;
