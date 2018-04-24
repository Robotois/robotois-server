const moment = require('moment');

const buildMeta = (reported) => Object.keys(reported)
  .reduce(
    (result, key) => ({
      ...result,
      [key]: moment().utcOffset(-5)
    }),
    {}
  );


const updateReported = (state, reported, broker) => {
  const meta = Object.keys(reported).reduce(
    (result, category) => ({
      ...result,
      [category]: buildMeta(reported[category])
    }),
    {}
  );
  const acceptedState = { reported: { ...reported }, metadata: { ...meta } };
  broker.publish({
    topic: 'superToi/shadow/update/accepted',
    payload: JSON.stringify(acceptedState),
    qos: 1,
  });
  return {
    ...state,
    reported: {
      ...state.reported,
      ...reported,
    },
    metadata: {
      ...state.metadata,
      ...meta
    }
  }
};

module.exports = updateReported;
