var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// RestURLs
// Presentation
app.get('/', function(req, res){
  res.sendFile('/FRONT/index.html', {"root": __dirname});
});
// Controller
app.get('/meister/', function(req, res){
  res.sendFile('/FRONT/meister.html', {"root": __dirname});
});
// Chat
app.get('/chat/', function(req, res){
  res.sendFile('/FRONT/chat.html', {"root": __dirname});
});
// Presentations
app.get('/presentations/', function(req, res){
  res.sendFile('/presentations/test.html', {"root": __dirname});
});

// Load only resources.
app.use("/css", express.static(__dirname + '/FRONT/css'));
app.use("/js", express.static(__dirname + '/FRONT/js'));
app.use("/lib", express.static(__dirname + '/FRONT/lib'));
app.use("/plugin", express.static(__dirname + '/FRONT/plugin'));
app.use("/partials", express.static(__dirname + '/FRONT/partials'));

// Chat
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on('slidenav', function(msg){
    console.log('slidenav: ' + msg);
    io.emit('slidenav', msg);
  })

});

// Start server
http.listen(3000, function(){
  console.log('listening on *:3000');
});
