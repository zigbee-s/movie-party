// Creating Central Server

// Importing essential packages
var express = require('express');  

// Setting up the http server
var app = express();  
var server = require('http').createServer(app);  


// Setting up incoming request from http://localhost:8000" (client server) socket.io 
const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:8000",
      methods: ["GET", "POST"]
    }
  });


// Port server will listen too 3000 or set by the cloud provider
const { PORT =3000 } = process.env;
server.listen(PORT);

// Return Port listening to on get request
app.get('/',(req,res) => {
    res.json(PORT);
})


// On connection to the client's socket
io.on('connection', function (socket) {

  // on recieving message related to state of the video (pause, play)
   socket.on('vid-state',state=>{

     // emitting the message to other client servers
       io.emit('vid-state',state);
   })

   // on recieving message related to seek (video played time)
   socket.on('progress-bar-clicked',newTime => {

          // emitting the message to other client servers
      io.emit('progress-bar-clicked',newTime);
   })
}); 

