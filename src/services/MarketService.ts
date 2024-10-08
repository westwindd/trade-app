
import axios from 'axios';
import { Stock } from '../models/Stock';

export class MarketService {
    private apiKey: string;
    private apiUrl: string;

    constructor() {
        this.apiKey = process.env.STOCK_API_KEY || 'YOUR_API_KEY';
        this.apiUrl = 'https://www.alphavantage.co/query';
    }

    public async getStockPrice(symbol: string): Promise<Stock> {
        try {
            const response = await axios.get(this.apiUrl, {
                params: {
                    function: 'GLOBAL_QUOTE',
                    symbol: symbol,
                    apikey: this.apiKey,
                },
            });

            const data = response.data['Global Quote'];
            if (!data) {
                throw new Error('Invalid stock symbol or API limit reached');
            }

            const stock = new Stock(
                data['01. symbol'],
                parseFloat(data['05. price']),
                '' 
            );

            return stock;
        } catch (error) {
            throw new Error(`Failed to fetch stock price: ${error.message}`);
        }
    }
}
