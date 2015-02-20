var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var presentationName = "";

var checkAuth = function (req, res, next) {
  //console.log(('query ',req.query));
  next();
  if (req.query.user == 'meister' && req.query.password == 'preso123') {
    next()
  } else {
    res.send('Unauthorized');
  }
};

var readFiles = function (dir) {
  console.log('Reading files in: '+dir);
	return fs.readdirSync(dir);
};

// RestURLs
// Presentation
app.get('/', function(req, res){
  res.sendFile('/FRONT/index.html', {"root": __dirname});
});
// Controller
app.get('/meister/', function(req, res){
  res.sendFile('/FRONT/meister.html', {"root": __dirname});
});
app.post('/meister/', checkAuth, function(req, res){
  res.send('ok');
});
// Chat
app.get('/chat/', function(req, res){
  res.sendFile('/FRONT/chat.html', {"root": __dirname});
});
// Presentations
app.get('/presentationName/', function(req, res){
  res.send(presentationName);
});
app.post('/presentationName/', checkAuth, function(req, res){
  if (req.query.presentationName) {
    presentationName = req.query.presentationName;
    res.send('ok');
  } else {
    presentationName = "";
    res.send('nok');
  }
});
app.get('/presentations/', function(req, res){
	var files = readFiles(__dirname + '/presentations/presentationSlides');
  res.send(files.filter(function(file){return file.indexOf('.html')>-1}));
});


app.get('/vote', function (req, res) {
  res.send(('Vote: %j', req.query))
})

// Load only resources.
app.use("/css", express.static(__dirname + '/FRONT/css'));
app.use("/js", express.static(__dirname + '/FRONT/js'));
app.use("/lib", express.static(__dirname + '/FRONT/lib'));
app.use("/plugin", express.static(__dirname + '/FRONT/plugin'));
app.use("/partials", express.static(__dirname + '/FRONT/partials'));
app.use("/presentationSlides", express.static(__dirname + '/presentations/presentationSlides'));

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

  socket.on('presentationStopped', function(msg){
    console.log('presentationStopped: ' + msg);
    io.emit('presentationStopped', msg);
  })

});

// Start server
http.listen(80, function(){
  console.log('listening on *:80');
});
