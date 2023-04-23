import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/:username', (req: Request, res: Response) => {
    res.send(req.params);
});

router.get('/:username/status/:id(\\d+)', (req: Request, res: Response) => {
    res.send(req.params);
});

export { router };