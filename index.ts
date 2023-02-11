import "reflect-metadata";
import express, { Application, Request, Response } from 'express'
import { ApolloServer } from 'apollo-server-express';
import { createServer } from "http";
import db from './src/db/init';
import { models } from './src/db/models';
import resolvers from './src/resolvers';
import typeDefs from './src/typedefs';

const app: Application = express()
const port: number = 3000

// Body parsing Middleware
const server = new ApolloServer({
    resolvers,
    typeDefs,
    context: { models }
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', async(req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({ message: `OK` })
})



const start = async (): Promise<void> => {
    try {
        await server.start();
        server.applyMiddleware({ app, path: '/graphql' });
        const httpServer = createServer(app);
        await db.sync();

        httpServer.listen(port, () => {
            console.log("Server started on port 3000, graphql on http://localhost:3000/graphql");
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start();
