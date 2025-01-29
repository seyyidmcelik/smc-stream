import { type NextFunction, type Request, type Response } from 'express';

declare module 'express' {
    export interface Request {
        userId?: string;
    }
}