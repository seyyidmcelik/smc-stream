import { type CookieOptions, type Request, type Response } from 'express';

import User from '../models/User.ts';
import { generateAccessToken, generateRefreshToken } from '../utils/index.ts';

export const register = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = new User({ username, password });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshTokens.push({ token: refreshToken, createdAt: new Date() });
        await user.save();

        const cookieOptions: CookieOptions = {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === 'true',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        };

        res.cookie('refreshToken', refreshToken, cookieOptions);
        res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });

        res.status(200).json({ accessToken, refreshToken });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.cookies;

        if (refreshToken) {
            const user = await User.findOne({ 'refreshTokens.token': refreshToken });
            if (user) {
                user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
                await user.save();
            }
        }

        res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.COOKIE_SECURE === 'true', sameSite: 'strict' });
        res.clearCookie('accessToken', { httpOnly: true, secure: process.env.COOKIE_SECURE === 'true', sameSite: 'strict' });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const logoutAll = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.cookies;
        if (refreshToken) {
            const user = await User.findOne({ 'refreshTokens.token': refreshToken });
            if (user) {
                user.refreshTokens = [];
                await user.save();
            }
        }

        res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.COOKIE_SECURE === 'true', sameSite: 'strict' });
        res.clearCookie('accessToken', { httpOnly: true, secure: process.env.COOKIE_SECURE === 'true', sameSite: 'strict' });
        res.status(200).json({ message: 'Logged out from all devices' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};