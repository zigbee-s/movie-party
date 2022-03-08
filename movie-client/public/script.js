// Connection to server

// Heroku deploy: 
let herokuLink = "https://movie-party-server.herokuapp.com/";

// Local deploy: 
let localDeploy = "http://localhost:3000/";

// Linking to socket conecction
var socket = io.connect(herokuLink, {
    reconnection: true
});

// On connection to socket
socket.on('connect', function () {

    // On arrival of message
    socket.on('message',msg => {
        alert(msg);
    })

    // On recieving video state (play, pause)
    socket.on('vid-state',state=>{

        // Playing the video
        if(vid.paused){
            vid.play();
            playPauseBtn.innerHTML = "&#9612;&#9612;";
         }

        // Pausing the video
         else {
            vid.pause();
            playPauseBtn.innerHTML = "&#9658";
         }
    })

    // On recieveing info related to progress-bbar or seek
    socket.on('progress-bar-clicked',newTime => {
        // Changing the current position or time of the video
        vid.currentTime = newTime;
    })

});

// Client side
// Setting variables for html elements, classes, id 
const vid = document.getElementById('videoPlayer');
const playPauseBtn = document.getElementById('play-pause');
const progress = document.getElementById('progress-bar');
const fullscreenBtn = document.getElementById('fullscreen');
const container = document.getElementById('container');
const volinc = document.getElementById('volinc');
const voldec = document.getElementById('voldec');



// Toggle fullscreen mode
fullscreenBtn.addEventListener('click',openFullscreen);

// Control play and pause
playPauseBtn.addEventListener('click',pauseOrstart);

// Control progressBar on update in the time
vid.addEventListener('timeupdate', updateProgressBar);
 

// Changing the length of the progress-bar on user click
progress.addEventListener('click', function(e) {
    var pos = (e.pageX  - this.offsetLeft) / this.offsetWidth;
    var newTime =pos * vid.duration;
    socket.emit('progress-bar-clicked',newTime);
});



volinc.addEventListener('click', function(e) {
    alterVolume('+');
});


voldec.addEventListener('click', function(e) {
    alterVolume('-');
});

 



//Functions

// On click of paue/play button send the message telling clicked
function pauseOrstart(){
    socket.emit('vid-state','clicked');
}

// Open fullscreen mode
function openFullscreen(){
    if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) { /* Safari */
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) { /* IE11 */
        container.msRequestFullscreen();
      }
}

// Function to update progress bar on message from socket
function updateProgressBar(){
    var progressBar = document.getElementById('progress-bar');
    var percentage = Math.floor((100 / vid.duration) * vid.currentTime);
    progressBar.value = percentage;
};

function alterVolume(dir){
    var currentVolume = Math.floor(vid.volume * 10) / 10;
   if (dir === '+') {
      if (currentVolume < 1) vid.volume += 0.1;
   }
   else if (dir === '-') {
      if (currentVolume > 0) vid.volume -= 0.1;
   }
}

