var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  

const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:8000",
      methods: ["GET", "POST"]
    }
  });

const { PORT =3000 } = process.env;

server.listen(PORT);

app.get('/',(req,res) => {
    res.json(PORT);
})


io.on('connection', function (socket) {
   socket.on('vid-state',state=>{
       io.emit('vid-state',state);
   })

   socket.on('progress-bar-clicked',newTime => {
      io.emit('progress-bar-clicked',newTime);
   })
}); 

