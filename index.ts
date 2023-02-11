import "reflect-metadata";
import express, { Application, Request, Response } from 'express'
import db from './src/db/init';
const app: Application = express()
const port: number = 3000

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', async(req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({ message: `OK` })
})

const start = async (): Promise<void> => {
    try {
        await db.sync();
        app.listen(port, () => {
            console.log("Server started on port 3000");
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start();
