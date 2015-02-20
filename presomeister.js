var dirPath = 'C:\Capathon\presomeister\preso-meister\FRONT';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// RestURLs
app.get('/', function(req, res){
  res.sendFile('/FRONT/index.html', {"root": __dirname});
});
app.get('/meister/', function(req, res){
  res.sendFile('/FRONT/meister.html', {"root": __dirname});
});
app.get('/chat/', function(req, res){
  res.sendFile('/FRONT/chat.html', {"root": __dirname});
});

app.use(express.static(__dirname + '/FRONT'));

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
http.listen(3000, function(){
  console.log('listening on *:3000');
});
