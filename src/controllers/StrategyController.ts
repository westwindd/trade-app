// src/controllers/StrategyController.ts

import { Request, Response } from 'express';
import { StrategyService } from '../services/StrategyService';
import { UserService } from '../services/UserService';
import { IStrategy } from '../interfaces/IStrategy';

export class StrategyController {
    private strategyService: StrategyService;
    private userService: UserService;

    constructor(strategyService?: StrategyService, userService?: UserService) {
        this.strategyService = strategyService || new StrategyService();
        this.userService = userService || new UserService();
    }

    public async applyStrategy(req: Request, res: Response): Promise<void> {
        const userId = req.user.id;
        const { strategyType, parameters } = req.body;

        try {
            const user = await this.userService.getUserById(userId);
            const strategy = this.strategyService.getStrategyInstance(strategyType, parameters);

            if (!strategy) {
                res.status(400).json({ error: 'Invalid strategy type' });
                return;
            }

            const trade = await strategy.execute(user);

            res.status(200).json({
                message: 'Strategy applied successfully',
                tradeExecuted: trade ? true : false,
                tradeDetails: trade || null,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    public async getAvailableStrategies(req: Request, res: Response): Promise<void> {
        try {
            const strategies = this.strategyService.getAvailableStrategies();
            res.status(200).json({ strategies });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    public async createCustomStrategy(req: Request, res: Response): Promise<void> {
        const userId = req.user.id;
        const { strategyName, logic } = req.body;

        try {
            await this.strategyService.createCustomStrategy(userId, strategyName, logic);
            res.status(201).json({ message: 'Custom strategy created successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
