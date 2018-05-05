function RelayProto({ client, topic}) {
  this.client = client;
  this.topic = topic;
  this.relayStatus = 0;
}
RelayProto.prototype.initClient = function initClient() {
  this.client.subscribe(this.topic, { qos: 1 });
  // this.client.on('message', this.messageProcessor.bind(this));
  this.write(0);
};

RelayProto.prototype.write = function write(value) {
  this.relayStatus = value !== undefined ? value : this.relayStatus;
  if (this.client !== undefined) {
    const message = {
      reported: {
        digitalIo: {
          relay: this.relayStatus
        }
      }
    };
    this.client.publish(this.topic, JSON.stringify(message), { qos: 1 });
  }
};

RelayProto.prototype.toggle = function toggle () {
  if (this.relayStatus === 1 ) {
    this.write(0)
  } else {
    this.write(1)
  }
};

RelayProto.prototype.messageProcessor = function messageProcessor(topic, jsonState) {
  const { desired } = jsonState;
  if (desired && desired.digitalIo) {
     this.write(desired.digitalIo.relay);
  }
};

const RelayCreator = ({ client, topic }) => {
  const myRelay = new RelayProto({ client, topic });
  myRelay.initClient();
  return myRelay;
};

module.exports = RelayCreator;
