let title = document.getElementsByTagName("title")[0];

let prevSong  = document.getElementById("prev-song");
let timeM10   = document.getElementById("time-10s");
let btn_play  = document.getElementById("play-btn");
let timeP10   = document.getElementById("time+10s");
let nextSong  = document.getElementById("next-song");
let timestamp = document.getElementById("timestamp");
let volume    = document.getElementById("volume");
let mute      = document.getElementById("mute");

let loop       = document.getElementById("loop");
let queue      = document.getElementById("queue");
let speed      = document.getElementById("speed");
let fullscreen = document.getElementById("fullscreen");
let detach     = document.getElementById("detach");
let remote     = document.getElementById("remote");

let bar = document.getElementById("timebar");
let songlist = document.getElementById("songlist");
let audio = document.getElementById("audio");


let music_url = '/music/';

let song_urls = [];
let song_names = [];
let idx = 0;
updateAudioSrc(idx);

let is_fullscreen = false;
fullscreen.onclick = toggleFullscreen;
function toggleFullscreen(){
    is_fullscreen = !is_fullscreen;
    if (is_fullscreen) {
        document.documentElement.requestFullscreen();
        colorToGreen(fullscreen);
    }else{
        document.exitFullscreen();
        colorToWhite(fullscreen);
    }
}

audio.ontimeupdate = updateToTimeBar;
function updateToTimeBar(){
    function n(x) {
        x = parseInt(x);
        if (x < 10) {
            return "0" + x.toString();
        }
        return x.toString();
    }
    bar.value = audio.currentTime / audio.duration * 300;
    let d_m = n(audio.duration / 60);
    let d_s = n(audio.duration % 60);
    let c_m = n(audio.currentTime / 60);
    let c_s = n(audio.currentTime % 60);
    timestamp.innerHTML = `&nbsp;${c_m}:${c_s}/${d_m}:${d_s}&nbsp;`;
}

bar.onchange = updateFromTimeBar;
function updateFromTimeBar(){
    audio.currentTime = audio.duration * (bar.value / 300);
    send_state();
}

speed.oninput = changeSpeed;
function changeSpeed(){
    audio.playbackRate = speed.value;
    if (speed.value == "1.0"){
        colorToWhite(speed);
    } else {
        colorToGreen(speed);
    }
    send_state();
}

btn_play.onclick = togglePlay;
function togglePlay(){
    if (audio.paused){
        colorToGreen(btn_play);
        audio.play();
        title.innerHTML = song_names[idx];
    } else {
        colorToWhite(btn_play);
        audio.pause();
        title.innerHTML = "Music Player"
    }
    send_state();
    updateUI();
}

timeP10.onclick = next10sec;
function next10sec() {
    colorToGreen(timeP10);
    setTimeout(()=>{
        colorToWhite(timeP10);
    }, 150);
    audio.currentTime += 10;
    send_state();
}

timeM10.onclick = prev10sec;
function prev10sec() {
    colorToGreen(timeM10);
    setTimeout(()=>{
        colorToWhite(timeM10);
    }, 150);
    audio.currentTime -= 10;
    send_state();
}

let is_muted = false;
mute.onclick = toggleMute;
function toggleMute(){
    is_muted = !is_muted;
    if (is_muted) {
        colorToGreen(mute);
    } else {
        colorToWhite(mute);
    }
    if (!is_remote){
        audio.muted = is_muted;
    }
    send_state();
}

let is_loop = false;
loop.onclick = toggleLoop;
function toggleLoop(){
    is_loop = !is_loop;
    if (is_loop) {
        colorToGreen(loop);
    } else {
        colorToWhite(loop);
    }
    send_state();
}

let is_detach = false;
detach.onclick = toggleDetach;
function toggleDetach(){
    is_detach = !is_detach;
    if (is_detach) {
        colorToGreen(detach);
    } else {
        colorToWhite(detach);
    }
}

let is_remote = false;
remote.onclick = toggleRemote;
function toggleRemote(){
    is_remote = !is_remote;
    if (is_remote) {
        audio.muted = true;
        colorToGreen(remote);
    } else {
        colorToWhite(remote);
    }
    updateUI();
}

let seed = (new Date()).getTime();
queue.oninput = changeQueue;
function changeQueue(){
    if (queue.value == "single") {
        colorToWhite(queue);
    } else {
        colorToGreen(queue);
    }
    if (queue.value === "shuf"){
        seed = (new Date()).getTime();
    }
    send_state();
}

audio.onended = playNextSong;
nextSong.onclick = playNextSong;
function playNextSong(){
    if (queue.value === "single"){
        if (is_loop) {
            updateAudioSrc(idx);
        } else {
            return;
        }
    } else {
        if (!is_loop && idx === song_names.length - 1) {
            return;
        }
        updateAudioSrc(idx + 1);
    }
    bar.value = 0;
    colorToGreen(nextSong);
    setTimeout(()=>{
        colorToWhite(nextSong);
    }, 150);
    togglePlay();
    send_state();
    updateUI();
}

prevSong.onclick = playPrevSong;
function playPrevSong(){
    if (queue.value === "single"){
        if (is_loop) {
            updateAudioSrc(idx);
        } else {
            return;
        }
    }else{
        if (!is_loop && idx === 0) {
            return;
        }
        updateAudioSrc(idx - 1);
    }
    colorToGreen(prevSong);
    setTimeout(()=>{
        colorToWhite(prevSong);
    }, 150);
    togglePlay();
    send_state();
    updateUI();
}

volume.oninput = setVolume;
function setVolume() {
    if (volume.value > 100){
        volume.value = 100;
    } else if (volume.value < 0 || volume.value == NaN){
        volume.value = 0;
    }
    audio.volume = volume.value / 100;
    send_state();
}

function colorToGreen(el){
    el.style.backgroundColor = "lightgreen";
}

function colorToWhite(el){
    el.style.backgroundColor = "white";
}

function colorToBlue(el){
    el.style.backgroundColor = "#87c1ff";
}

function updateAudioSrc(i) {
    idx = (i + song_urls.length) % song_urls.length;
    audio.src = music_url + song_urls[idx]
}

function updateUI(){
    // fullscreen button
    if (is_fullscreen) {
        colorToGreen(fullscreen);
    }else{
        colorToWhite(fullscreen);
    }

    // timeBar
    updateToTimeBar();

    // speed
    if (speed.value == "1.0"){
        colorToWhite(speed);
    } else {
        colorToGreen(speed);
    }

    // play btn
    if (audio.paused){
        colorToWhite(btn_play);
        title.innerHTML = "Music Player";
    } else {
        colorToGreen(btn_play);
        title.innerHTML = song_names[idx];
    }

    // mute
    if (is_muted) {
        colorToGreen(mute);
    } else {
        colorToWhite(mute);
    }

    // loop
    if (is_loop) {
        colorToGreen(loop);
    } else {
        colorToWhite(loop);
    }

    // detach
    if (is_detach) {
        colorToGreen(detach);
    } else {
        colorToWhite(detach);
    }
    let s = document.getElementsByClassName("song");
    for (let i = 0; i < s.length; i++) {
        colorToBlue(s[i]);
        if (s[i].attributes.idx.value === idx.toString()){
            colorToGreen(s[i])
        }
    }
}

function selectSong(el){
    updateAudioSrc(parseInt(el.attributes.idx.value));
    togglePlay();
    updateUI();
}

function updateSongList() {
    songlist.innerHTML = "";
    for (let i = 0; i < song_names.length; i++) {
        songlist.innerHTML += `<li class="song" idx="${i}" onclick="selectSong(this)">${song_names[i]}</li>`;
    }
}