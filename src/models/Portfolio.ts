import { Stock } from './Stock';

export class Portfolio {
    private stocks: Map<Stock, number>;
    
    constructor() {
        this.stocks = new Map<Stock, number>();
    }

    addStock(stock: Stock, quantity: number): void {
        if (this.stocks.has(stock)) {
            this.stocks.set(stock, this.stocks.get(stock)! + quantity);
        } else {
            this.stocks.set(stock, quantity);
        }
    }

    getTotalValue(): number {
        let totalValue = 0;
        this.stocks.forEach((quantity, stock) => {
            totalValue += stock.price * quantity;
        });
        return totalValue;
    }
}
