var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'presomeister@gmail.com',
        pass: 'preso123'
    }
});
var sentMail = function(user, email, message) {
	transporter.sendMail({
			from: 'presomeister@gmail.com',
			to: email,
			subject: 'Your Preso-Meister Notes',
			text: 'Dear '+user
				+',\n\nHere are your notes from the preso-meister presentation.\n\n'
				+message
				+'\n\nWe hope that you have enjoyed our presentation application. Please vote for us!\nBest regards,\n\nPreso-Meister'
	});
};

// Global variables.
var presentationName = "";
var votes = {};

// Global functions.
var checkAuth = function (req, res, next) {
  //console.log(('query ',req.query));
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
var addVote = function (topic, value) {
  var t = votes[topic];
	if (t) {
	} else {
		votes[topic] = {};
	}

	var v = votes[topic][value];
	if (v && v >= 0) {
		votes[topic][value]++;
	} else {
		votes[topic][value] = 1;
	}
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

// Vote
app.get('/vote', function (req, res) {
	var v = votes[req.query.topic];
	if (v) {
		res.send(votes[req.query.topic]);
	} else {
		res.send({});
	}
})
app.post('/vote', function (req, res) {
	addVote(req.query.topic, req.query.value);
	io.emit('votes', votes[req.query.topic]);
	res.send(votes[req.query.topic]);
})
app.delete('/vote', function (req, res) {
	votes = {};
	io.emit('votes', votes);
	res.send(votes);
})
// Sent mail
app.post('/notes', function (req, res) {
	sentMail(req.query.user, req.query.email, req.query.message);
	res.send('ok');
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
