import express, { Request, Response } from 'express';
import { con } from '../database/Mysql.database.js';

const router = express.Router();

// Test get request
router.get('/list', (req: Request, res: Response) => {
    console.log('chirps.ts', req.user);
    // console.log('chirp.ts', req.session.id);
    if (req.isUnauthenticated()) {
        res.send({ message: 'Request failed.' });
        return;
    }

    con.query('SELECT * FROM users', function (err, results) {
        if (err) throw err;
        res.send(results);
    })
});

// router.get('/:username', (req: Request, res: Response) => {
//     res.send(req.params);
// });

// router.get('/:username/status/:id(\\d+)', (req: Request, res: Response) => {
//     res.send(req.params);
// });


export { router };