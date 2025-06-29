export interface IRedisConfig {
    defaultTtlSeconds: number;
    lockExpiredSeconds: number;
    connection: {
        host: string;
        port: number;
        sentinels: {
            host: string;
            port: number;
        }[] | null;
        name: string | null;
        password: string | null;
        basePrefix: string;
        db: number;
    };
}
//# sourceMappingURL=redis.config.interface.d.ts.map