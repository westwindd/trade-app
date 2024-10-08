// src/controllers/UserController.ts

import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
    private userService: UserService;

    constructor(userService?: UserService) {
        // Allow dependency injection for testing or use a new instance
        this.userService = userService || new UserService();
    }

    // Register a new user
    public async register(req: Request, res: Response): Promise<void> {
        const { name, email, password } = req.body;

        try {
            const user = await this.userService.registerUser(name, email, password);
            res.status(201).json({
                message: 'User registered successfully',
                userId: user.id,
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // User login
    public async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;

        try {
            const token = await this.userService.authenticateUser(email, password);
            res.status(200).json({
                message: 'Login successful',
                token: token,
            });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    // Get user profile
    public async getProfile(req: Request, res: Response): Promise<void> {
        const userId = req.user.id; // Assuming authentication middleware sets req.user

        try {
            const user = await this.userService.getUserById(userId);
            res.status(200).json({
                id: user.id,
                name: user.name,
                email: user.email,
                balance: user.balance,
                portfolioValue: user.portfolio.getTotalValue(),
            });
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    // Add funds to user account
    public async addFunds(req: Request, res: Response): Promise<void> {
        const userId = req.user.id;
        const { amount } = req.body;

        try {
            await this.userService.addFunds(userId, amount);
            res.status(200).json({ message: 'Funds added successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
