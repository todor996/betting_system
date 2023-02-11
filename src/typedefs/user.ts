const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: Int!
    name: String!
    balance: Float!
    bets: [Bet!]
  }

  type Query {
    getUser(id: Int): User
    getUserList: [User!]
  }
`;

export default typeDefs;
