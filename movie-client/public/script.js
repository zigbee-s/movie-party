// Connection to server
var socket = io.connect("http://localhost:3000/", {
    reconnection: true
});

socket.on('connect', function () {
    socket.on('message',msg => {
        alert(msg);
    })

    socket.on('vid-state',state=>{
        if(vid.paused){
            vid.play();
            playPauseBtn.innerHTML = "&#9612;&#9612;";
         }
         else {
            vid.pause();
            playPauseBtn.innerHTML = "&#9658";
         }
    })

    socket.on('progress-bar-clicked',newTime => {
        vid.currentTime = newTime;
    })

});

// Client side
const vid = document.getElementById('videoPlayer');
const playPauseBtn = document.getElementById('play-pause');
const progress = document.getElementById('progress-bar');
const fullscreenBtn = document.getElementById('fullscreen');
const container = document.getElementById('container');
const volinc = document.getElementById('volinc');
const voldec = document.getElementById('voldec');




fullscreenBtn.addEventListener('click',openFullscreen);
playPauseBtn.addEventListener('click',pauseOrstart);


vid.addEventListener('timeupdate', updateProgressBar);
 
 
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

function pauseOrstart(){
    socket.emit('vid-state','clicked');
}

function openFullscreen(){
    if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) { /* Safari */
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) { /* IE11 */
        container.msRequestFullscreen();
      }
}

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

