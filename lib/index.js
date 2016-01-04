var Redis = require('ioredis')
  , socketIo = require('socket.io')
  , chalk = require('chalk')
  , redis = require('@ftbl/redis')
  , log = require('@ftbl/log');

var Socket = function(name, server) {
  if (this instanceof Socket === false) return new Socket(name, server);
  
  this.io = socketIo(server);
  this.name = name;
  this.sessions = {};
};

Socket.prototype.listen = function() {
  var connection = this.connection
    , sessions = this.sessions;

  this.io.on('connection', function(socket) {
    socket.setMaxListeners(0);

    var parse = function(channel, message) {
      message = JSON.parse(message);

      return { 
        name: channel.split(':')[1]
      , data: message.data
      , options: message.options 
      };
    };

    var signOn = function(session) {
      sessions[session] = session;
      socket.session = session;

      socket.connection = new Redis(redis.config);
      socket.connection.psubscribe('bus:*');

      socket.connection.on('pmessage', function(pattern, channel, message) {
        var data = parse(channel, message)
          , sessionId = data.options.session && data.options.session.id;

        if (data.options.session == null || (sessionId && sessionId === socket.session)) {
          socket.emit(data.name, data.data);
        }
      });
    };

    var close = function() {
      if (socket.connection) {
        socket.connection.punsubscribe('bus:*');
        socket.connection.quit();
      }
    };

    var signOut = function(session) {
      close();

      if (session) sessions[session] = null;

      socket.session = null;
    };

    var disconnect = function() {
      if (socket.session) signOut(socket.session);

      socket = null;
    };

    socket.on('signOn', signOn);
    socket.on('signOut', signOut);
    socket.on('disconnect', disconnect);
  });
};

module.exports = Socket;
