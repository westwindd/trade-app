import { Stock } from './Stock';

export class Trade {
    constructor(
        public stock: Stock,
        public quantity: number,
        public tradeType: 'BUY' | 'SELL',
        public price: number,
        public timestamp: Date
    ) {}

}
