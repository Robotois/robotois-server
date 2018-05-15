const GraphQLJSON = require('graphql-type-json');

const { groups, group, groupDevices, groupWeekStats, groupMonthStats, groupStats } = require('./group');
const { globalStats } = require('./global');

const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    groups,
    group,
    globalStats,
  },
  Group: {
    stats: groupStats,
    devices: groupDevices,
    // weekStats: groupWeekStats,
    // monthStats: groupMonthStats,
  },
};

module.exports = resolvers;
