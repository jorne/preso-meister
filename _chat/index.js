var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//app.use(express.static(__dirname+'/..' + '/FRONT/'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

});

<<<<<<< HEAD:SOCKET/index.js
http.listen(3000, function(){
  console.log('listening on *:3000');
=======
http.listen(3001, function(){
  console.log('listening on *:3001');
>>>>>>> dfff9cee6424acc680403427bd6ebe26f0ae8699:_chat/index.js
});
