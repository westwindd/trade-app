// src/strategies/StrategyBase.ts

import { User } from '../models/User';
import { Trade } from '../models/Trade';
import { IStrategy } from '../interfaces/IStrategy';

export abstract class StrategyBase implements IStrategy {
    abstract execute(user: User): Promise<Trade | null>;

    protected logTrade(trade: Trade | null): void {
        if (trade) {
            console.log(
                `Trade executed: ${trade.tradeType} ${trade.quantity} shares of ${trade.stock.symbol} at $${trade.price.toFixed(2)}`
            );
        }
    }
}
