const { gql } = require('apollo-server');

const typeDefs = gql`
  type Bet {
    id: Int!
    userId: Int!
    chance: Float!
    payout: Float!
    win: Boolean!
    user: User!
  }

  type Query {
    getBet(id: Int): Bet
    getBetList: [Bet!]
    getBestBetPerUser(limit: Int): [Bet!]
  }

  type Mutation {
    createBet(userId: Int, betAmount: Float, chance: Float): Bet
  }
`;

export default typeDefs;
