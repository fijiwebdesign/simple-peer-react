var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var debug = require('debug')('screen-share:server')

const PORT = process.env.PORT || 4000

let sockets = {}

// https://socket.io/docs/emit-cheatsheet/

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  debug('a user connected');
  
  io.emit('peer', {
    peerId: socket.id
  })

  socket.on('disconnect', reason => {
    io.emit('unpeer', {
      peerId: socket.id,
      reason
    })
  })

  socket.on('signal', msg => {
    debug('signal received', msg)
    const receiverId = msg.to
    const receiver = io.sockets.connected[receiverId]
    if (receiver) {
      const data = {
        from: socket.id,
        ...msg
      }
      debug('sending signal to', receiverId)
      io.to(receiverId).emit('signal', data);
    } else {
      debug('no receiver found', receiverId)
    }
  })

});

http.listen(PORT, function(){
  debug('listening on *:' + PORT);
});