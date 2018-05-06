const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const resetButton = require('./robotois-reset');
const wifiRoutes = require('./routes/wifi-routes');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

resetButton.init();
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
app.use('/wifi', wifiRoutes);

app.listen(8082, () => {
  console.log('Go to http://localhost:3000/graphiql to run queries!');
});
