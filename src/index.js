const ioModules = require('./IoModules');

const mqttBroker = require('./Broker');
const shadowService = require('./Shadow');

mqttBroker().then((broker) => {
  shadowService(broker);
  ioModules();
});
