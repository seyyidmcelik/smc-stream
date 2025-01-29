export interface IUser extends Document {
    username: string;
    password: string;
    refreshTokens: { token: string; createdAt: Date }[];
    comparePassword(password: string): Promise<boolean>;
}

export interface IConfig {
    PORT: string;
    MONGO_URI: string;
    RABBITMQ_URL: string;
    EXCHANGE_NAME: string;
    JWT_SECRET_ACCESS: string;
    JWT_SECRET_REFRESH: string;
    JWT_EXPIRES_IN: string;
    COOKIE_SECURE: string;
    CLIENT_URL: string;
}

export interface IError extends Error {
    status?: number;
}