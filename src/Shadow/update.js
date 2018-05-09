const moment = require('moment');

const merge = (mainObj, obj) => {
  const mainKeys = Object.keys(mainObj);
  const newKeys = Object.keys(obj);

}

const oneLevelMerge = (mainObj, obj) => Object.keys(mainObj).reduce(
  (result, key) => ({
    ...result,
    [key]: {
      ...mainObj[key],
      ...(obj[key] ? obj[key] : {}),
    }
  }),
  {});

const buildMeta = (reported) => Object.keys(reported)
  .reduce(
    (result, key) => ({
      ...result,
      [key]: moment().utcOffset(-5),
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
  // console.log('updateState:', oneLevelMerge(state[updateType], newState));
  const updatedState = {
    ...state,
    [updateType]: {
      ...oneLevelMerge(state[updateType], newState),
    },
    metadata: {
      ...state.metadata,
      [updateType]: {
        ...(state.metadata && state.metadata[updateType] ? oneLevelMerge(state.metadata[updateType], meta) : meta),
      }
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
    // console.log('updatedState:', updatedState);
    // console.log('updatedMeta:', acceptedState.metadata);
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
