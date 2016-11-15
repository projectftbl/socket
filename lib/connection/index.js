var configuration = require('@recipher/configuration')
  , provider = configuration('listener') || 'redis'
  , Connection =  require('./' + provider);
    
module.exports = Connection;
