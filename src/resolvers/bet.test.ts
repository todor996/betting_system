import db from '../db/init';
const { gql } = require('apollo-server');
import request from 'supertest-graphql'
import startApolloServer from "../server";
import {Server} from "http";
import {models} from "../db/models";
let server: Server | null = null;

const bet = {
    userId: 1,
    payout: 20,
    betAmount: 10,
    chance: 0.5,
    win: false,
    id: 1
}
beforeAll(async () => {
    await db.sync();
    await models.User.create({
        name: 'Test user 1',
        balance: 200
    })
    await models.Bet.create(bet,{raw: true})
    server = await startApolloServer();
})

afterAll(async () => {
    await db.dropAllSchemas({});
    await db.close();
    await server?.close();
})

describe("Bet tests", () => {
    it("check if query returns previously created bet", async () => {
        const { data } = await request(server)
            .query(gql`
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
    it("check if query returns previously created bet", async () => {
        const { data } = await request(server)
            .query(gql`
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
    it("check if query returns null for invalid bet id", async () => {
        const { data } = await request(server)
            .query(gql`
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
});
