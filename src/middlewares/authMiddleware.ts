import { type NextFunction, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';

import { CONFIG } from '../config';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;
    if (!accessToken) {
        res.status(401).json({ message: 'Access token required' });
        return;
    };

    try {
        const decoded = jwt.verify(accessToken, CONFIG.JWT_SECRET_ACCESS) as { userId: string };
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired access token' });
    }
};