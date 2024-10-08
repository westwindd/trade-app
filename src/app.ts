// src/app.ts

import express from 'express';
import { UserController } from './controllers/UserController';
import { TradeController } from './controllers/TradeController';
import { StrategyController } from './controllers/StrategyController';
import { authMiddleware } from './middleware/authMiddleware';

const app = express();
app.use(express.json());

const userController = new UserController();
const tradeController = new TradeController();
const strategyController = new StrategyController();

app.post('/api/register', (req, res) => userController.register(req, res));
app.post('/api/login', (req, res) => userController.login(req, res));
app.get('/api/profile', authMiddleware, (req, res) => userController.getProfile(req, res));
app.post('/api/add-funds', authMiddleware, (req, res) => userController.addFunds(req, res));

app.post('/api/trade', authMiddleware, (req, res) => tradeController.executeTrade(req, res));
app.get('/api/trade/history', authMiddleware, (req, res) => tradeController.getTradeHistory(req, res));
app.get('/api/portfolio', authMiddleware, (req, res) => tradeController.getPortfolio(req, res));

app.get('/api/strategies', authMiddleware, (req, res) => strategyController.getAvailableStrategies(req, res));
app.post('/api/strategy/apply', authMiddleware, (req, res) => strategyController.applyStrategy(req, res));
app.post('/api/strategy/custom', authMiddleware, (req, res) => strategyController.createCustomStrategy(req, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
