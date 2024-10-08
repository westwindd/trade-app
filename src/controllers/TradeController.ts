// src/controllers/TradeController.ts

import { Request, Response } from 'express';
import { TradeService } from '../services/TradeService';
import { UserService } from '../services/UserService';

export class TradeController {
    private tradeService: TradeService;
    private userService: UserService;

    constructor(tradeService?: TradeService, userService?: UserService) {
        this.tradeService = tradeService || new TradeService();
        this.userService = userService || new UserService();
    }

    public async executeTrade(req: Request, res: Response): Promise<void> {
        const userId = req.user.id;
        const { symbol, quantity, tradeType } = req.body;

        try {
            const user = await this.userService.getUserById(userId);
            const trade = await this.tradeService.executeTrade(user, symbol, quantity, tradeType);

            res.status(200).json({
                message: 'Trade executed successfully',
                trade: {
                    stock: trade.stock.symbol,
                    quantity: trade.quantity,
                    tradeType: trade.tradeType,
                    price: trade.price,
                    timestamp: trade.timestamp,
                },
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    public async getTradeHistory(req: Request, res: Response): Promise<void> {
        const userId = req.user.id;

        try {
            const trades = await this.tradeService.getTradeHistory(userId);
            res.status(200).json({ trades });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    public async getPortfolio(req: Request, res: Response): Promise<void> {
        const userId = req.user.id;

        try {
            const portfolio = await this.userService.getUserPortfolio(userId);
            res.status(200).json({ portfolio });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
