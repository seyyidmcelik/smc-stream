import express, { type Router } from 'express';

import { login, logout, logoutAll, register } from '../controllers/authController.ts'

const router: Router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/logoutAll', logoutAll);

export default router;