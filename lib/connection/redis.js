var redis = require('@recipher/redis')
  , Redis = require('ioredis')

var Connection = function() {
  this.redis = new Redis(redis.config);

  this.psubscribe = function() {
    this.redis.psubscribe.apply(this.redis, arguments);
  };

  this.punsubscribe = function(name) {
    this.redis.punsubscribe.apply(this.redis, arguments);
  };

  this.on = function(evt, on) {
    this.redis.on.apply(this.redis, arguments);
  };

  this.quit = function() {
    this.redis.quit.apply(this.redis, arguments);
  };
};

module.exports = Connection;
