// src/strategies/CustomStrategy.ts

import { StrategyBase } from './StrategyBase';
import { User } from '../models/User';
import { Trade } from '../models/Trade';
import { TradeService } from '../services/TradeService';
import { MarketService } from '../services/MarketService';
import { VM } from 'vm2';

export class CustomStrategy extends StrategyBase {
    private tradeService: TradeService;
    private marketService: MarketService;
    private userLogic: string;

    constructor(
        tradeService: TradeService,
        marketService: MarketService,
        parameters: { userLogic: string }
    ) {
        super();
        this.tradeService = tradeService;
        this.marketService = marketService;
        this.userLogic = parameters.userLogic;
    }

    public async execute(user: User): Promise<Trade | null> {
        try {
            const trade = await this.executeUserLogic(user);
            this.logTrade(trade);
            return trade;
        } catch (error) {
            console.error('Error executing custom strategy:', error);
            return null;
        }
    }

    private async executeUserLogic(user: User): Promise<Trade | null> {
        const vm = new VM({
            timeout: 1000,
            sandbox: {
                user,
                tradeService: this.tradeService,
                marketService: this.marketService,
                Trade,
                console,
            },
        });

        const script = `
            (async () => {
                ${this.userLogic}
            })()
        `;

        const result = await vm.run(script);
        return result;
    }
}
