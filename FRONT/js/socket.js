var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('chat message', function(msg){
  console.log('message: ' + msg);
  //io.emit('chat message', msg);
});
