import { QueryTypes } from 'sequelize';
import db from '../db/init';

const betResolvers = {
  Query: {
    async getBet(_: any, { id }: { id: number }, { models: { Bet } }: any) {
      return Bet.findByPk(id, { raw: true });
    },
    async getBetList(root: any, args: any, { models: { Bet } }: any) {
      return Bet.findAll({ raw: true });
    },
    async getBestBetPerUser(root: any, args: any, context: any) {
      /***
       * TODO
       * Find proper syntax to execute this via sequelize mapper, atm sorted with raw query
       *
       * */
      const bets = await db.query(
        `SELECT b.*
FROM bet b
JOIN (
  SELECT userId, MIN(chance) AS min_chance
  FROM bet
  WHERE win = true
  GROUP BY userId
) min_chances
ON b.userId = min_chances.userId
AND b.chance = min_chances.min_chance
WHERE b.win = true
GROUP BY b.userId
ORDER BY b.chance ASC
LIMIT :limit;`,
        {
          replacements: { limit: args.limit || 0 },
          type: QueryTypes.SELECT
        }
      );
      return bets;
    }
  },
  Mutation: {
    async createBet(
      root: any,
      { userId, betAmount, chance }: any,
      { models: { Bet, User } }: any
    ) {
      const foundUser = await User.findByPk(userId);
      if (!foundUser) {
        throw new Error('Invalid user id');
      }
      if (chance <= 0 || chance > 1) {
        throw new Error('Invalid betting chance provided');
      }
      if (foundUser.dataValues.balance < betAmount) {
        throw new Error('Insufficient funds');
      }
      let userBalance = foundUser.dataValues.balance;
      userBalance -= betAmount;
      const payout = (1 / chance) * betAmount;
      const win = Math.random() < chance;
      const bet = await Bet.create(
        {
          userId,
          payout,
          betAmount,
          chance,
          win
        },
        { raw: true }
      );
      if (win) {
        userBalance += payout;
      }
      await foundUser.update({
        balance: userBalance
      });
      return bet.dataValues;
    }
  }
};

export default betResolvers;
