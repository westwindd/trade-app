// src/services/TradeService.ts

import { Trade } from '../models/Trade';
import { User } from '../models/User';
import { MarketService } from './MarketService';
import { TradeRepository } from '../repositories/TradeRepository';
import { UserRepository } from '../repositories/UserRepository';
import { Portfolio } from '../models/Portfolio';

export class TradeService {
    private marketService: MarketService;
    private tradeRepository: TradeRepository;
    private userRepository: UserRepository;

    constructor(
        marketService?: MarketService,
        tradeRepository?: TradeRepository,
        userRepository?: UserRepository
    ) {
        this.marketService = marketService || new MarketService();
        this.tradeRepository = tradeRepository || new TradeRepository();
        this.userRepository = userRepository || new UserRepository();
    }

    public async executeTrade(
        user: User,
        symbol: string,
        quantity: number,
        tradeType: 'BUY' | 'SELL'
    ): Promise<Trade> {
        if (quantity <= 0) {
            throw new Error('Quantity must be greater than zero');
        }

        const stock = await this.marketService.getStockPrice(symbol);
        const totalCost = stock.price * quantity;

        if (tradeType === 'BUY') {
            if (user.balance < totalCost) {
                throw new Error('Insufficient funds');
            }
            user.balance -= totalCost;
            user.portfolio.addStock(stock, quantity);
        } else if (tradeType === 'SELL') {
            const ownedQuantity = user.portfolio.getStockQuantity(stock);
            if (ownedQuantity < quantity) {
                throw new Error('Insufficient stock holdings');
            }
            user.balance += totalCost;
            user.portfolio.removeStock(stock, quantity);
        } else {
            throw new Error('Invalid trade type');
        }

        const trade = new Trade(stock, quantity, tradeType, stock.price, new Date());
        await this.tradeRepository.saveTrade(user.id, trade);
        await this.userRepository.updateUser(user);

        return trade;
    }

    public async getTradeHistory(userId: string): Promise<Trade[]> {
        return this.tradeRepository.getTradesByUserId(userId);
    }
}
