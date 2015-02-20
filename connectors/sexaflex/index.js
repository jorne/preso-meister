var io = require('socket.io-client');

  client = io.connect('http://beaconflex.eu-gb.mybluemix.net');
  presentation = io.connect('http://localhost');

  client.on('slidenav',function(slide) {
    console.log('slide: ' + slide);
    //client.emit("test","foo");
    presentation.emit('slidenav', slide);
  });

  presentation = io.connect('http://localhost');
