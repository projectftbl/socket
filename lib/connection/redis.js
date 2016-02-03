var redis = require('@ftbl/redis')
  , Redis = require('ioredis')

module.exports = new Redis(redis.config);
