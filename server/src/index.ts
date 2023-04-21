import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { db } from './database/Mysql.database.js';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);

    // Initializes the database tables.
    db.createDatabase();
});

// Creates connection with the database.
const con = db.con();

con.connect((err) => {
    if (err) {
        console.error(`[database]: error connecting due to ${err.stack}`);
        return;
    }

    console.log(`[database]: connected as ${con.threadId}`);
});