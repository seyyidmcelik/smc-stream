import jwt from 'jsonwebtoken';
import { type NextFunction, type Request, type Response } from 'express';

import { CONFIG } from '../config/index.ts';
import { type IError, type IConfig } from '../interfaces/index.ts';

export const getConfig = (item: keyof IConfig): string => {
    return process.env[item] as string;
};

export const handleErrors = (err: IError, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        message: err.message || 'An unexpected error occurred',
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
};

export const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, CONFIG.JWT_SECRET_ACCESS, {
        expiresIn: '15m',
    });
};

export const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, CONFIG.JWT_SECRET_REFRESH, {
        expiresIn: '7d',
    });
};