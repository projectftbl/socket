var configuration = require('@ftbl/configuration')
  , provider = configuration('listener') || 'redis'
  , Connection =  require('./' + provider);
    
module.exports = Connection;
