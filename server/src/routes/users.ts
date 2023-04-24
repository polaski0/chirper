import express, { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import { con } from '../database/Mysql.database.js';

import passport from 'passport';
import passportLocal from 'passport-local';

const LocalStrategy = passportLocal.Strategy;

const router = express.Router();
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));

passport.use(
    new LocalStrategy(
        function verify(username, password, cb) {
            con.query('SELECT * FROM users WHERE username = ?', [username], function (err, results, fields) {
                if (err) return cb(err);
                if (!results.length) {
                    return cb(null, false, { message: 'Incorrect username or password.' });
                }

                crypto.pbkdf2(password, results[0].salt, 310000, 32, 'sha256', function (err, hashedPassword) {
                    if (err) return cb(err);
                    if (!crypto.timingSafeEqual(results[0].hashed_password, hashedPassword)) {
                        return cb(null, false, { message: 'Incorrect username or password.' });
                    }

                    return cb(null, results[0]);
                });
            });
        }
    )
);

passport.serializeUser((user: any, cb) => {
    process.nextTick(() => {
        cb(null, user);
    });
});

passport.deserializeUser((user: any, cb) => {
    process.nextTick(() => {
        return cb(null, user);
    })
})

// Checks user credentials and log in if successful.
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/failed',
    keepSessionInfo: true,
}), function (req: Request, res: Response) {
    console.log('users.ts', req.user);
    // console.log('users.ts', req.session.id);
    const { id, username, first_name, middle_name, last_name } = req.session.passport?.user;
    res.send({ loggedIn: true, user: { id, username, first_name, middle_name, last_name } });
});

// Creates new user
router.post('/register', (req: Request, res: Response, next: NextFunction) => {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
        if (err) return next(err);
        con.query('INSERT INTO users (username, email_address, first_name, middle_name, last_name, hashed_password, salt) VALUES (?, ?, ?, ?, ?, ?, ?)', [
            req.body.username,
            req.body.email_address,
            req.body.first_name,
            req.body.middle_name,
            req.body.last_name,
            hashedPassword,
            salt
        ], function (err) {
            if (err) return next(err);
            res.send('Successfully created an account.');
        })
    });
});

router.get('/failed', (req: Request, res: Response) => {
    res.send({ loggedIn: false });
});

router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
    req.logout(function (err) {
        if (err) return next(err);

        res.send({ loggedIn: false });
    })
});

export { router };