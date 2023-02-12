import express, { Application, Request, Response } from 'express'
import { ApolloServer } from 'apollo-server-express';
import { createServer, Server } from "http";
import { models } from './db/models';
import schema from '../src/schema';
import db from './db/init';
const startApolloServer = async (): Promise<Server> => {
    try {
        const app: Application = express()
        const port: number = 3000

        const server = new ApolloServer({
            schema,
            context: { models }
        })
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.get('/', async(req: Request, res: Response): Promise<Response> => {
            return res.status(200).send({ message: `OK` })
        })
        await db.sync();
        const bet = {
            userId: 1,
            payout: 100,
            betAmount: 10,
            chance: 0.15,
            win: false,
        }
        await server.start();
        server.applyMiddleware({ app, path: '/graphql' });

        const httpServer = createServer(app);
        httpServer.listen(port, () => {
            console.log("Server started on port 3000, graphql on http://localhost:3000/graphql");
        });
        return httpServer;
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

export default startApolloServer;
