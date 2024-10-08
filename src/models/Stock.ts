export class Stock {
    constructor(
        public symbol: string,
        public price: number,
        public companyName: string
    ) {}

    updatePrice(newPrice: number): void {
        this.price = newPrice;
    }
}
