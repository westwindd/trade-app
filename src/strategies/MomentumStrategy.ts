// src/strategies/MomentumStrategy.ts

import { StrategyBase } from './StrategyBase';
import { User } from '../models/User';
import { Trade } from '../models/Trade';
import { TradeService } from '../services/TradeService';
import { MarketService } from '../services/MarketService';

export class MomentumStrategy extends StrategyBase {
    private tradeService: TradeService;
    private marketService: MarketService;
    private symbol: string;
    private threshold: number;

    constructor(
        tradeService: TradeService,
        marketService: MarketService,
        parameters: { symbol: string; threshold: number }
    ) {
        super();
        this.tradeService = tradeService;
        this.marketService = marketService;
        this.symbol = parameters.symbol;
        this.threshold = parameters.threshold;
    }

    public async execute(user: User): Promise<Trade | null> {
        // Fetch current and previous prices
        const currentPrice = (await this.marketService.getStockPrice(this.symbol)).price;
        const previousPrice = await this.getPreviousPrice(this.symbol);

        const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;

        if (priceChange > this.threshold) {
            // Upward momentum - Buy
            const trade = await this.tradeService.executeTrade(user, this.symbol, 10, 'BUY');
            this.logTrade(trade);
            return trade;
        } else if (priceChange < -this.threshold) {
            // Downward momentum - Sell
            const trade = await this.tradeService.executeTrade(user, this.symbol, 10, 'SELL');
            this.logTrade(trade);
            return trade;
        } else {
            // No significant change
            return null;
        }
    }

    private async getPreviousPrice(symbol: string): Promise<number> {
        // Implement logic to fetch previous closing price
        // For demonstration, we'll use mock data
        const prices = await this.marketService.getHistoricalPrices(symbol, 2);
        return prices[0]; // Return the price from one period ago
    }
}
