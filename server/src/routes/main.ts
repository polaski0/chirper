import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Home Page');
});

router.get('/login', (req: Request, res: Response) => {
    res.send('Login Page');
});

router.get('/register', (req: Request, res: Response) => {
    res.send('Register Page');
});

export { router };