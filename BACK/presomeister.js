var dirPath = 'C:\Capathon\presomeister\preso-meister\FRONT';
var app = require('express')();
var http = require('http').Server(app);

app.get('/', function(req, res){
  res.send('<h1>Hello</h1>');
});
app.get('/presomeister/', function(req, res){
  res.sendFile('/FRONT/index.html', {"root": __dirname+'/..'});
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
