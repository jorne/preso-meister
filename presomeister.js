var dirPath = 'C:\Capathon\presomeister\preso-meister\FRONT';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// RestURLs
app.get('/', function(req, res){
  res.send('<h1>Hello</h1>');
});
app.get('/presomeister/', function(req, res){
  res.sendFile('/FRONT/index.html', {"root": __dirname});
});

app.use(express.static(__dirname + '/FRONT/'));

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
