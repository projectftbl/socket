var redis = require('@ftbl/redis')
  , Redis = require('ioredis')

var Connection = function() {
  this.redis = new Redis(redis.config);
};

module.exports = Connection;
