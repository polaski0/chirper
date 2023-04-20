import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
    console.log(process.env);
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});