from flask import *
from flask_socketio import SocketIO, emit
import os
import tomllib
from urllib.parse import quote

with open("my_settings.toml", "rb") as f:
    settings = tomllib.load(f)
HOST = settings['server']['host']
PORT = settings['server']['port']
DEBUG = settings['server']['debug']
TOKEN = settings['server']['token']
MUSIC_FOLDER = settings['server']['music_folder']
BASE_URL = settings['server']['base_url']
INC_SELF = False

settings['keyboard'] = {
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
} | settings['keyboard']


def update_music_list(seed=None):
    songs = list(sorted(os.listdir(MUSIC_FOLDER)))
    if seed:
        import random
        random.seed(seed)
        random.shuffle(songs)
    return list(songs)


def strip_ext(f: str):
    ext = [".mp3", ".m4a", ".aif", ".wav",
           ".mid", ".wow", ".ogg", ".wma",
           ".flac", ".wave"
           ]
    n = f.lower()
    for i in ext:
        if n.endswith(i):
            return f[:-len(i)]
    return f


app = Flask(__name__)
app.secret_key = TOKEN
sock = SocketIO(app)


@app.context_processor
def global_vars():
    d = {
        "BASE_URL": BASE_URL,
    }
    return d


@app.route('/')
def index():
    return render_template("index.html")


@sock.on("audio")
def handle_audio(data):
    emit("audio", data, broadcast=not data['detach'], include_self=INC_SELF)

    if data['queue'] == "shuf" and data['new_seed']:
        l = update_music_list(data['seed'])
        sock.emit("server", {
            "music_url": BASE_URL + "music/",
            'song_urls': list(map(quote, l)),
            'song_names': list(map(strip_ext, l))
        }, broadcast=not data['detach'], include_self=True)
    if data['queue'] == "linear" and data['new_seed']:
        l = update_music_list()
        sock.emit("server", {
            "music_url": BASE_URL + "music/",
            'song_urls': list(map(quote, l)),
            'song_names': list(map(strip_ext, l))
        }, broadcast=not data['detach'], include_self=True)


@sock.on("connect")
def new_connection():
    sock.emit("server", {
        "music_url": BASE_URL + "music/",
        'song_urls': list(map(quote, update_music_list())),
        'song_names': list(map(strip_ext, update_music_list()))
    })

    emit("keyboard", settings['keyboard'])


@app.route('/music/<path:filename>')
def custom_static(filename):
    return send_from_directory(MUSIC_FOLDER, filename)


if __name__ == '__main__':
    print(PORT)
    sock.run(
        app,
        host=HOST,
        port=PORT,
        debug=DEBUG,
    )
