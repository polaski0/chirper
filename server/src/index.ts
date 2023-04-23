import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { db } from './database/Mysql.database.js';

import { router as userRoutes } from './routes/users.js';
import { router as chirpsRoutes } from './routes/chirps.js';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// CORS & Parser
const corsOptions = {
    origin: 'http://127.0.0.1:5173',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'subscribe',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: (60 * 60 * 24) * 1000
    }
}));
app.use(passport.authenticate('session'));

// Initializes the database tables.
db.createDatabase();

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

// Routes
app.use('/', userRoutes);
app.use('/user', chirpsRoutes);