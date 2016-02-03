var configuration = require('@ftbl/configuration')
  , provider = configuration('listener') || 'redis'
  , connection =  require('./connection/' + provider);
    
module.exports = connection;
