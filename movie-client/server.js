// Creating Client Server

// Importing essential packages
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');


//set static folder
app.use(express.static(path.join(__dirname,"public")));


// Client server
app.get('/',function(req,res){
res.sendFile(__dirname + "/index.html");
})



// Video is playing
app.get('/video', function(req,res){

    const range = req.headers.range;

    if(!range){
        res.status(400).send("Require Range Header");
    }

    // Path to the video
    const videoPath = "video.mp4";

    // Setting video size
    const videoSize = fs.statSync("video.mp4").size;



    // Parse Range, size of video requested in each request
    const CHUNK_SIZE = 10**6; //1MB
    const start = Number(range.replace(/\D/g, ""));

    const end = Math.min(start + CHUNK_SIZE, videoSize -1);

    const contentLength = end - start +1;

    // Setting Headers
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    }; 

    res.writeHead(206, headers);

    // Creating a stream 
    const videoStream = fs.createReadStream(videoPath, { start, end });


    // Stream the video chunk to the client
    videoStream.pipe(res);

});

// Client server listening on port: 8000
app.listen(8000);
