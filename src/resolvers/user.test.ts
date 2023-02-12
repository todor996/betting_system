import db from '../db/init';
const { gql } = require('apollo-server');
import request from 'supertest-graphql'
import startApolloServer from "../server";
import {Server} from "http";
import {models} from "../db/models";
let server: Server | null = null;

const user = {
    name: 'Test user 1',
    balance: 200,
    id: 1
}
beforeAll(async () => {
    await db.sync();
    await models.User.create(user)
    server = await startApolloServer();
})

afterAll(async () => {
    await db.dropAllSchemas({});
    await db.close();
    await server?.close();
})

describe("User tests", () => {
    it("check if query returns previously created user", async () => {
        const { data } = await request(server)
            .query(gql`
                query {
                        getUserList {
                            id
                            name
                            balance
                        }
                }
            `);
        expect((data as any).getUserList).toBeDefined();
        expect((data as any).getUserList[0]).toEqual(user);
    });
    it("check if query returns previously created user", async () => {
        const { data } = await request(server)
            .query(gql`
                query {
                        getUser(id: 1) {
                            id
                            name
                            balance
                        }
                }
            `);
        expect((data as any).getUser).toBeDefined();
        expect((data as any).getUser).toEqual(user);
    });
    it("check if query returns null for invalid user id", async () => {
        const { data } = await request(server)
            .query(gql`
                query {
                        getUser(id: 50) {
                            id
                            name
                            balance
                        }
                }
            `);
        expect((data as any).getUser).toEqual(null);
    });
});
