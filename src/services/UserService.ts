// src/services/UserService.ts

import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Portfolio } from '../models/Portfolio';

export class UserService {
    private userRepository: UserRepository;
    private jwtSecret: string;

    constructor(userRepository?: UserRepository) {
        this.userRepository = userRepository || new UserRepository();
        this.jwtSecret = process.env.JWT_SECRET || 'YOUR_SECRET_KEY';
    }

    public async registerUser(name: string, email: string, password: string): Promise<User> {
        const existingUser = await this.userRepository.getUserByEmail(email);
        if (existingUser) {
            throw new Error('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User(
            this.generateUserId(),
            name,
            email,
            hashedPassword,
            0, 
            new Portfolio()
        );

        await this.userRepository.saveUser(newUser);
        return newUser;
    }

    public async authenticateUser(email: string, password: string): Promise<string> {
        const user = await this.userRepository.getUserByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error('Invalid email or password');
        }

        const token = jwt.sign({ id: user.id }, this.jwtSecret, { expiresIn: '1h' });
        return token;
    }

    public async getUserById(userId: string): Promise<User> {
        const user = await this.userRepository.getUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    public async addFunds(userId: string, amount: number): Promise<void> {
        if (amount <= 0) {
            throw new Error('Amount must be greater than zero');
        }

        const user = await this.getUserById(userId);
        user.balance += amount;
        await this.userRepository.updateUser(user);
    }

    public async getUserPortfolio(userId: string): Promise<Portfolio> {
        const user = await this.getUserById(userId);
        return user.portfolio;
    }

    public verifyToken(token: string): string {
        try {
            const decoded = jwt.verify(token, this.jwtSecret) as { id: string };
            return decoded.id;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    private generateUserId(): string {
        return 'user_' + Date.now().toString();
    }
}
