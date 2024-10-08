// src/strategies/MovingAverageStrategy.ts

import { StrategyBase } from './StrategyBase';
import { User } from '../models/User';
import { Trade } from '../models/Trade';
import { TradeService } from '../services/TradeService';
import { MarketService } from '../services/MarketService';

export class MovingAverageStrategy extends StrategyBase {
    private tradeService: TradeService;
    private marketService: MarketService;
    private symbol: string;
    private shortTermPeriod: number;
    private longTermPeriod: number;

    constructor(
        tradeService: TradeService,
        marketService: MarketService,
        parameters: { symbol: string; shortTermPeriod: number; longTermPeriod: number }
    ) {
        super();
        this.tradeService = tradeService;
        this.marketService = marketService;
        this.symbol = parameters.symbol;
        this.shortTermPeriod = parameters.shortTermPeriod;
        this.longTermPeriod = parameters.longTermPeriod;
    }

    public async execute(user: User): Promise<Trade | null> {
        const shortTermMA = await this.calculateMovingAverage(this.symbol, this.shortTermPeriod);
        const longTermMA = await this.calculateMovingAverage(this.symbol, this.longTermPeriod);

        if (shortTermMA > longTermMA) {
            const trade = await this.tradeService.executeTrade(user, this.symbol, 10, 'BUY');
            this.logTrade(trade);
            return trade;
        } else if (shortTermMA < longTermMA) {
            const trade = await this.tradeService.executeTrade(user, this.symbol, 10, 'SELL');
            this.logTrade(trade);
            return trade;
        } else {
            return null;
        }
    }

    private async calculateMovingAverage(symbol: string, period: number): Promise<number> {
   
        const prices = await this.marketService.getHistoricalPrices(symbol, period);
        const sum = prices.reduce((acc, price) => acc + price, 0);
        return sum / prices.length;
    }
}
