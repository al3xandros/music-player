let sock = io();
let state = {
    paused:audio.paused,
    volume:audio.volume,
    muted:audio.muted,
    loop:is_loop,
    speed:audio.playbackRate,
    currentTime:audio.currentTime,
    song_idx:idx,
    queue:queue.value,
    detach:is_detach,
}

function send_state(){
    state = {
        paused:audio.paused,
        volume:audio.volume,
        muted:is_muted,
        loop:is_loop,
        speed:audio.playbackRate,
        currentTime:audio.currentTime,
        song_idx:idx,
        queue:queue.value,
        detach:is_detach,
        seed:seed,
        new_seed:new_seed,
    }
    new_seed = false;
    sock.emit("audio", state);
}

sock.on("audio", set_state)
function set_state(state){
    if (idx !== state.song_idx) {
        updateAudioSrc(state.song_idx);
    }
    if (state.paused){
        audio.pause();
    } else {
        audio.play();
    }
    audio.volume = state.volume;
    is_muted = state.muted;
    if (!is_remote){
        audio.muted = state.muted;
    }
    is_loop = state.loop;
    audio.playbackRate = state.speed;
    audio.currentTime = state.currentTime;
    queue.value = state.queue;
    updateUI();
}
sock.on("server", (data) => {
    music_url = data.music_url;
    song_urls = data.song_urls;
    song_names = data.song_names;
    updateSongList();
})

sock.on("keyboard", (data) => {
    keyboard = data;
})
