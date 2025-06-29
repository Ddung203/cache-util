# caching-manager

## Usage

```typescript
import {
  IMemoryConfig,
  IRedisConfig,
  CachingManagerControllerAdpBuilder,
} from 'caching-manager';

const memoryConfig: IMemoryConfig = {
  maxKeys: 100,
  defaultTtlSeconds: 180,
  lockExpiredSeconds: 10, //Atomic locking time
};

const redisConfig: IRedisConfig = {
  defaultTtlSeconds: 180,
  lockExpiredSeconds: 10, //Atomic locking time
  connection: {
    host: 'localhost',
    port: 6379,
    sentinels: null,
    name: null,
    password: null,
    basePrefix: 'test:',
    db: 0,
  },
};

const cacheUtil = new CachingManagerControllerAdpBuilder()
  .registerMemory(memoryConfig)
  .registerRedis(redisConfig)
  .build();

const ttlSeconds = [5, 10]; // 5 for first cacheMethod registed, 10 for second ...

const fetchDataFunc = () => Promise.resolve({ test: 'success' });

cacheUtil.getData('cacheKey', ttlSeconds, fetchDataFunc).then(console.log);
```
