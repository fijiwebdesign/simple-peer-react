'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var debug = require('debug')('screen-share:server');

var PORT = process.env.PORT || 4000;

var sockets = {};

// https://socket.io/docs/emit-cheatsheet/

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  debug('a user connected');

  io.emit('peer', {
    peerId: socket.id
  });

  socket.on('disconnect', function (reason) {
    io.emit('unpeer', {
      peerId: socket.id,
      reason: reason
    });
  });

  socket.on('signal', function (msg) {
    debug('signal received', msg);
    var receiverId = msg.to;
    var receiver = io.sockets.connected[receiverId];
    if (receiver) {
      var data = _extends({
        from: socket.id
      }, msg);
      debug('sending signal to', receiverId);
      io.to(receiverId).emit('signal', data);
    } else {
      debug('no receiver found', receiverId);
    }
  });
});

http.listen(PORT, function () {
  debug('listening on *:' + PORT);
});