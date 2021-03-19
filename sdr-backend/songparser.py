import os, sys
import json
import music
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import changef
import time
import datetime
import wave
import pyaudio
import pymysql
from ctypes import *


FREQS = [90.1,92.5,93.3,94.1,95.4,95.7,96.1,96.5,97.5,98.1,98.5,98.9,99.5,101.1,100.3,102.1,102.9,104.5,105.3,106.1,106.9,107.9]
CURFREQ = FREQS[0]

def getsound():
    CHUNK = 1024
    FORMAT = pyaudio.paInt16
    CHANNELS = 2
    RATE = 48000
    RECORD_SECONDS = 7
    WAVE_OUTPUT_FILENAME = 'output.wav'
    p = pyaudio.PyAudio()

    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)
    frames = []

    for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
        data = stream.read(CHUNK)
        frames.append(data)
    stream.stop_stream()
    stream.close()
    p.terminate()

    wf = wave.open(WAVE_OUTPUT_FILENAME, 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(p.get_sample_size(FORMAT))
    wf.setframerate(RATE)
    wf.writeframes(b''.join(frames))
    wf.close()


def get_spotify_album_link(json_data):

    auth_manager = SpotifyClientCredentials('72968dcb0e5244e7b771c0b492c7bb9e','f7a5e136fe344b9f8acdcda6a73c9470')
    sp = spotipy.Spotify(auth_manager=auth_manager)
    try:
        data = sp.track('spotify:track:' + json_data) #['album']['images'][0]['url']
    except:
        return None
    return data['album']['images'][0]['url'], data['external_urls']['spotify']


def recognize():
    raw = music.musicRecog("output.wav")
    formatted = json.loads(raw)

    if formatted['status'] == 'success' and formatted['result'] != None:

        print "----------------------------------------------------"
        print str(CURFREQ)
        print formatted
        if 'spotify' in formatted['result']:
            spotify_info = get_spotify_album_link(formatted['result']['spotify']['id'])
            if spotify_info != None:
                insert_into_db(formatted['result']['title'], formatted['result']['artist'], spotify_info[1], spotify_info[0], CURFREQ)
            else:
                insert_into_db(formatted['result']['title'], formatted['result']['artist'], 'N/A', 'N/A', CURFREQ)
        else:
            insert_into_db(formatted['result']['title'], formatted['result']['artist'], 'N/A', 'N/A', CURFREQ)
        print 'Title: ' + formatted['result']['title'] + ' Artist: ' + \
              formatted['result']['artist']

        print "----------------------------------------------------"

    else:
        print 'No result on frequency ' + str(CURFREQ)


"""
ACRCLOUD
def recognize():
    raw = music.musicRecog("output.wav")
    formatted = json.loads(raw)
    print formatted
    
    if formatted['status']['msg'] != 'No result':

        print "----------------------------------------------------"
        print str(CURFREQ)
        print(formatted)
        if 'spotify' in formatted['metadata']['music'][0]['external_metadata']:
            get_spotify_album_link(formatted['metadata']['music'][0]['external_metadata']['spotify']['track']['id'])
        print 'Title: ' + formatted['metadata']['music'][0]['title'] + ' Artist: ' + formatted['metadata']['music'][0]['artists'][0]['name']

        print "----------------------------------------------------"

    else:
        print 'No result on frequency ' + str(CURFREQ)
 """


ERROR_HANDLER_FUNC = CFUNCTYPE(None, c_char_p, c_int, c_char_p, c_int, c_char_p)


def py_error_handler(filename, line, function, err, fmt):
  pass
c_error_handler = ERROR_HANDLER_FUNC(py_error_handler)


def insert_into_db(song_name, song_artist, spotify_link, album_link, station_freq):
    db = pymysql.connect("rds-sdr-transcriber-mysql.c9vzpejjgwtu.us-east-1.rds.amazonaws.com", "admin", "sdr-db-1", "sdrtranscriberDB")
    cursor = db.cursor()
    now = datetime.datetime.now()

    # execute SQL query using execute() method.
    print 'DEBUG: ' + 'INSERT INTO song_played (song_name, song_artist, yt_link, album_cover, station_freq, time_played) VALUES("'+song_name+'", "'+song_artist+'", "'+spotify_link+'", "'+album_link+'", "'+str(station_freq)+'", "'+now.strftime('%Y-%m-%d %H:%M:%S')+'")'

    cursor.execute('INSERT INTO song_played (song_name, song_artist, yt_link, album_cover, station_freq, time_played) VALUES("'+song_name+'", "'+song_artist+'", "'+spotify_link+'", "'+album_link+'", "'+str(station_freq)+'", "'+now.strftime('%Y-%m-%d %H:%M:%S')+'")')
    db.commit()
    cursor.close()
    # Fetch a single row using fetchone() method.

    # disconnect from server
    db.close()

asound = cdll.LoadLibrary('libasound.so')
# Set error handler
asound.snd_lib_error_set_handler(c_error_handler)

#insert_into_db('blah')


while True:
    for x in FREQS:
        CURFREQ = x
        changef.cf(CURFREQ)
        time.sleep(0.25)
        #print 'CURFREQ: ' + str(CURFREQ)
        dbpower = changef.askdbpower()
        if (dbpower > -24.0):
            print 'RADIO STATION DETECTED ON ' + str(CURFREQ)
            time.sleep(1)
            getsound()
            recognize()
        else:
            pass


