import mongoose from 'mongoose';
import { CONFIG } from '../config/index.ts';

export async function connectToMongoDB() {
    try {
        await mongoose.connect(CONFIG.MONGO_URI);
        console.log('MongoDB connection established.');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}
