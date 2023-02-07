let keyboard = {
    "togglePlay": " ",
    "playNextSong": "n",
    "playPrevSong": "p",
    "next10sec": "ArrowRight",
    "prev10sec": "ArrowLeft",
    "volumeUp": "ArrowUp",
    "volumeDown": "ArrowDown",
    "toggleMute": "m",
    "toggleLoop": "l",
    "changeQueue": "q",
    "changeSpeedUp": ">",
    "changeSpeedDown": "<",
    "toggleFullscreen": "f",
    "toggleDetach": "d",
    "toggleRemote": "r"
}

document.body.onkeydown = (event) => {
    switch (event.key) {
        case keyboard.togglePlay:
            togglePlay();
            break;
        case keyboard.playNextSong:
            playNextSong();
            break;
        case keyboard.playPrevSong:
            playPrevSong();
            break;
        case keyboard.next10sec:
            next10sec();
            break;
        case keyboard.prev10sec:
            prev10sec();
            break;
        case keyboard.volumeUp:
            volume.value = parseInt(volume.value) + 10;
            setVolume();
            break;
        case keyboard.volumeDown:
            volume.value = parseInt(volume.value) - 10;
            setVolume();
            break;
        case keyboard.toggleMute:
            toggleMute();
            break;
        case keyboard.toggleLoop:
            toggleLoop();
            break;
        case keyboard.changeQueue:
            queue.selectedIndex = (queue.selectedIndex + 1) % 3;
            changeQueue();
            break;
        case keyboard.changeSpeedUp:
            if (speed.selectedIndex < 9) {
                speed.selectedIndex += 1;
                changeSpeed();
            }
            break;
        case keyboard.changeSpeedDown:
            if (speed.selectedIndex > 0) {
                speed.selectedIndex -= 1;
                changeSpeed();
            }
            break;
        case keyboard.toggleFullscreen:
            toggleFullscreen();
            break;
        case keyboard.toggleDetach:
            toggleDetach();
            break;
        case keyboard.toggleRemote:
            toggleRemote();
            break;
    }
    if (event.key in ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]) {
        audio.currentTime = (parseInt(event.key) / 10) * audio.duration;
    }
}