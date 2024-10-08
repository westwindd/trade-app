export class User {
    constructor(
        public id: string,
        public name: string,
        public balance: number,
        public portfolio: Portfolio
    ) {}

    addFunds(amount: number): void {
        this.balance += amount;
    }

}
