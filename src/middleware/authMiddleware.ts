// src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';

const userService = new UserService();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token

    if (!token) {
        return res.status(401).json({ error: 'Authentication token missing' });
    }

    try {
        const userId = userService.verifyToken(token); // Implement token verification
        const user = await userService.getUserById(userId);
        req.user = user; // Add user to request object
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid authentication token' });
    }
};
