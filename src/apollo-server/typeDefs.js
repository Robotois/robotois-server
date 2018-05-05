const typeDefs = `
  scalar JSON
  type Group {
    id: Int!
    title: String!
    active: Int!
    devices: [Device]
    stats: JSON!
  }
  type Stat {
    id: Int!
    type: String!
    group: Group
    device: Device
    date: String!
    value: Int!
  }
  type MonthStats {
    id: Int!
    type: String!
    group: Group
    device: Device
    value: Int!
    month: Int!
  }
  type Device {
    id: Int!
    iguId: String!
    title: String!
    name: String!
    active: Int!
    icon: String!
    group: Group
  }
  type Query {
    groups: [Group]
    group(id: Int!): Group
    device(id: Int!): Device
    globalStats: JSON
  }
`;

module.exports = typeDefs;
