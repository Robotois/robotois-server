const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

// const resetButton = require('./robotois-reset');
const wifiRoutes = require('./routes/wifi-routes');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');
const command = require('../shared/commands');
require('../SuperToi/buttons');

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

// resetButton();
const app = express();

app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema,
  // formatError: err => {
  //   if (err.originalError && err.originalError.error_message) {
  //     err.message = err.originalError.error_message;
  //   }
  //
  //   return err;
  // },
}));

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.use(logger('tiny'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/wifi', wifiRoutes);

app.get('/shutdown', (req, res) => {
  console.log('---> Robotois system going to shutdown...');
  res.status(200).json({
    ok: 'ok',
  });
  setTimeout(() => {
    command('sudo shutdown -h now');
  }, 500);
});


app.listen(8082, () => {
  console.log('Go to http://localhost:8082/graphiql to run queries!');
});
