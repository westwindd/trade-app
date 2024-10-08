// src/services/StrategyService.ts

import { User } from '../models/User';
import { IStrategy } from '../interfaces/IStrategy';
import { MovingAverageStrategy } from '../strategies/MovingAverageStrategy';
import { MomentumStrategy } from '../strategies/MomentumStrategy';
import { CustomStrategy } from '../strategies/CustomStrategy';
import { TradeService } from './TradeService';
import { UserRepository } from '../repositories/UserRepository';

export class StrategyService {
    private tradeService: TradeService;
    private userRepository: UserRepository;

    constructor(tradeService?: TradeService, userRepository?: UserRepository) {
        this.tradeService = tradeService || new TradeService();
        this.userRepository = userRepository || new UserRepository();
    }

    public getStrategyInstance(strategyType: string, parameters?: any): IStrategy | null {
        switch (strategyType) {
            case 'MovingAverage':
                return new MovingAverageStrategy(this.tradeService, parameters);
            case 'Momentum':
                return new MomentumStrategy(this.tradeService, parameters);
            case 'Custom':
                return new CustomStrategy(this.tradeService, parameters);
            default:
                return null;
        }
    }

    public getAvailableStrategies(): string[] {
        return ['MovingAverage', 'Momentum', 'Custom'];
    }

    public async createCustomStrategy(
        userId: string,
        strategyName: string,
        logic: string
    ): Promise<void> {
        const user = await this.userRepository.getUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (!user.customStrategies) {
            user.customStrategies = [];
        }

        user.customStrategies.push({
            name: strategyName,
            logic: logic, 
        });

        await this.userRepository.updateUser(user);
    }
}
