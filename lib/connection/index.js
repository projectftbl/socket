var configuration = require('@ftbl/configuration')
  , provider = configuration('listener') || 'redis'
  , connection =  require('./' + provider);
    
module.exports = connection;
