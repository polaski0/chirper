import express, { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import { con } from '../database/Mysql.database.js';

import passport from 'passport';
import passportLocal from 'passport-local';

const LocalStrategy = passportLocal.Strategy;

const router = express.Router();

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
        cb(null, { id: user.id, username: user.username, first_name: user.first_name, middle_name: user.middle_name, last_name: user.last_name });
    })
});

passport.deserializeUser((user: any, cb) => {
    process.nextTick(() => {
        return cb(null, user);
    })
})

// Checks user credentials and log in if successful.
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login'
}), (req: Request, res: Response) => {
    res.redirect('/login');
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
            console.log(hashedPassword, salt);
            res.send('Successfully created an account.');
        })
    });
});

router.get('/login', (req: Request, res: Response) => {
    if (req.session.passport?.user) {
        res.send({ loggedIn: true, user: req.session.passport.user });
    } else {
        res.send({ loggedIn: false });
    }
});

router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
    req.logout(function (err) {
        if (err) return next(err);

        res.redirect('/');
    })
});

export { router };