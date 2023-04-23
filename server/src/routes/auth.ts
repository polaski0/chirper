import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import { con } from '../database/Mysql.database.js';

import passport from 'passport';
import passportLocal from 'passport-local';

const LocalStrategy = passportLocal.Strategy;

const router = express.Router();
const urlEncodeParser = bodyParser.urlencoded({ extended: true });

passport.use(
    new LocalStrategy(
        function verify(username, password, cb) {
            con.query('SELECT * FROM users WHERE username = ?', [username], function (err, results, fields) {
                if (err) return cb(err);
                if (!results.length) {
                    return cb(null, false, { message: 'Incorrect username or password.' });
                }

                crypto.pbkdf2(password, results[0].password, 310000, 32, 'sha256', function (err, hashedPassword) {
                    if (err) return cb(err);
                    console.log(results);
                    if (!crypto.timingSafeEqual(results[0].hashed_password, hashedPassword)) {
                        return cb(null, false, { message: 'Incorrect username or password.' });
                    }
                    return cb(null, results);
                });
            });
        }
    )
);

// Checks user credentials and log in if successful.
router.post('/auth', passport.authenticate('local', {
    successRedirect: '/success',
    failureRedirect: '/failed'
}));

// router.post('/auth', urlEncodeParser, (req: Request, res: Response) => {
//     con.query('SELECT * FROM users WHERE username = ?', [req.body.username], function (err, results) {
//         if (err) throw err;
//         if (!results.length) {
//             res.send('Incorrect username or password.');
//             return;
//         }

//         res.send(req.body);
//     });
// });

router.get('/logout', (req: Request, res: Response) => {
    res.send('Logout');
});

router.get('/success', (req: Request, res: Response) => {
    res.send('Success');
});

router.get('/failed', (req: Request, res: Response) => {
    res.send('Failed');
});

export { router };