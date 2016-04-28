var _ = require('lodash')
  , Redis = require('ioredis')
  , socketIo = require('socket.io')
  , chalk = require('chalk')
  , log = require('@ftbl/log');

var Socket = function(name, server) {
  if (this instanceof Socket === false) return new Socket(name, server);
  
  this.io = socketIo(server);
  this.name = name;
  this.sessions = {};
};

Socket.prototype.listen = function() {
  var sessions = this.sessions;

  this.io.on('connection', function(socket) {
    socket.setMaxListeners(0);

    var parse = function(channel, message) {
      message = JSON.parse(message);

      return { 
        name: channel.substring(channel.indexOf(':')+1)
      , data: _.assign({}, message.data)
      , options: _.assign({}, message.options)
      };
    };

    var signOn = function(session) {
      if (socket.session) return socket.session = session;

      sessions[session] = session;
      socket.session = session;

      var Connection = require('./connection');
      socket.connection = new Connection;
      socket.connection.psubscribe('bus:*');

      socket.connection.on('pmessage', function(pattern, channel, message) {
        var data = parse(channel, message)
          , userId = data.options.userId
          , sessionId = data.options.session && data.options.session.id;

        if (data.options.broadcast === true ||
           (userId === socket.session) ||
           (sessionId === socket.session && (userId == null || userId === sessionId))) {
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
