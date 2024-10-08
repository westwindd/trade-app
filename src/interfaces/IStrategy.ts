// src/interfaces/IStrategy.ts

import { User } from '../models/User';
import { Trade } from '../models/Trade';

export interface IStrategy {
    execute(user: User): Promise<Trade | null>;
}
