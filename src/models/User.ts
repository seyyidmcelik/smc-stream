import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import { type IUser } from '../interfaces/index.ts';

const UserSchema = new mongoose.Schema<IUser>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshTokens: [
        {
            token: { type: String },
            createdAt: { type: Date, default: Date.now },
        },
    ],
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

UserSchema.methods.comparePassword = async function (password: string) {
    return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', UserSchema);