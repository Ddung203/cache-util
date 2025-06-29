export interface ICacheGwAdp {
  getName(): string;
  getData(key: string): Promise<string | null>;
  setData(key: string, value: string, ttlSeconds: number): Promise<void>;
  checkIsLocking(key: string): Promise<boolean>;
  clearLock(key: string): Promise<void>;
} 