import db from '../db/init';
import { gql } from 'apollo-server';
import request from 'supertest-graphql';
import startApolloServer from '../server';
import { Server } from 'http';
import { models } from '../db/models';
let server: Server | null = null;

const bet = {
  userId: 1,
  payout: 20,
  betAmount: 10,
  chance: 0.5,
  win: false,
  id: 1
};
beforeAll(async () => {
  await db.sync();
  await models.User.create({
    id: 1,
    name: 'Test user 1',
    balance: 200
  });
  await models.User.create({
    id: 2,
    name: 'Test user 1',
    balance: 200
  });
  await models.User.create({
    id: 3,
    name: 'Test user 2',
    balance: 200
  });
  await models.Bet.create(bet);
  await models.Bet.create({ ...bet, id: 2, win: true });
  await models.Bet.create({ ...bet, id: 3 });
  await models.Bet.create({ ...bet, id: 4, userId: 2, win: true });


  server = await startApolloServer();
});

afterAll(async () => {
  await db.dropAllSchemas({});
  await db.close();
  await server?.close();
});

describe('Bet tests', () => {
  it('check if query returns previously created bet', async () => {
    const { data } = await request(server).query(gql`
      query {
        getBetList {
          payout
          userId
          id
          chance
          betAmount
          win
        }
      }
    `);
    expect((data as any).getBetList).toBeDefined();
    expect((data as any).getBetList[0]).toEqual(bet);
  });
  it('check if query returns previously created bet', async () => {
    const { data } = await request(server).query(gql`
      query {
        getBet(id: 1) {
          payout
          userId
          id
          chance
          betAmount
          win
        }
      }
    `);
    expect((data as any).getBet).toBeDefined();
    expect((data as any).getBet).toEqual(bet);
  });
  it('check if query returns null for invalid bet id', async () => {
    const { data } = await request(server).query(gql`
      query {
        getBet(id: 50) {
          payout
          userId
          id
          chance
          betAmount
          win
        }
      }
    `);
    expect((data as any).getBet).toEqual(null);
  });

  it('check if mutation for win does not deduce user balance', async () => {
    const getUser = gql`
      query {
        getUser(id: 1) {
          balance
        }
      }
      `;

    const { data: oldUserData } = await request(server).query(getUser);
    console.log(oldUserData);
    const { data } = await request(server).query(gql`
      mutation {
        createBet(userId: 1, betAmount: 20, chance: 1) {
          payout
          userId
          id
          chance
          betAmount
          win
        }
      }
    `);
    const { data: newUserData } = await request(server).query(getUser);
    console.log((newUserData as any).getUser);

    expect((data as any).getBet).not.toEqual(null);
    expect((newUserData as any).getUser.balance).toEqual((oldUserData as any).getUser.balance);
  });

  it('check mutation if win balance is larger if lose balance is lower', async () => {
    const getUser = gql`
      query {
        getUser(id: 1) {
          balance
        }
      }
      `;

    const { data: oldUserData } = await request(server).query(getUser);
    const { data } = await request(server).query(gql`
      mutation {
        createBet(userId: 1, betAmount: 20, chance: 0.5) {
          win
        }
      }
    `);
    const win = (data as any).createBet.win;
    const { data: newUserData } = await request(server).query(getUser);

    expect((data as any).createBet).not.toEqual(null);
    if(win)
    expect((newUserData as any).getUser.balance).toBeGreaterThan((oldUserData as any).getUser.balance);
    else {
      expect((oldUserData as any).getUser.balance).toBeGreaterThan((newUserData as any).getUser.balance);
    }
  });
  it('check if query best bet returns array of two entries for two users with win true', async () => {
    const { data } = await request(server).query(gql`
      query {
        getBestBetPerUser {
          payout
        }
      }
    `);
    expect((data as any).getBestBetPerUser).not.toEqual(null);
    expect((data as any).getBestBetPerUser).toHaveLength(2);

  });
  it('check if query best bet returns array of 1 entries for two users with win true and limit 1', async () => {
    const { data } = await request(server).query(gql`
      query {
        getBestBetPerUser(limit: 1) {
          payout
        }
      }
    `);
    expect((data as any).getBestBetPerUser).not.toEqual(null);
    expect((data as any).getBestBetPerUser).toHaveLength(1);

  });
});
