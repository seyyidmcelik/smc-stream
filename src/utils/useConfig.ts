const { env } = process;

export const getConfig = <T = any>(item: string, defaultValue: T): T => {
    const value = env[item]?.trim();
    return (value ?? defaultValue) as T;
};
