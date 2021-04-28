import os, sys
import json
import music
import sdrcontrol
import time
import datetime
import pymysql
import transcriber
import threading
from ctypes import *


#FREQS = [90.1,92.5,93.3,94.1,95.7,96.1,96.5,97.5,98.1,98.5,98.9,99.5,101.1,100.3,102.1,102.9,104.5,105.3,106.1,106.9,107.9]
FREQS = [90.1,92.5,95.7,96.5,98.1,98.5,98.9,99.5,100.3,101.1,101.3,102.1,102.9,103.7,104.5,105.3,106.1,106.9,107.9]
CURFREQ = FREQS[0]
SONG_MEMORY = {}


def recognize(filename, station_freq):
    raw = music.musicRecog(filename)
    formatted = json.loads(raw)
    print(raw)
    if formatted['status'] == 'success' and formatted['result'] != None:
        album_art_link = 'https://rootzwiki.com/uploads/monthly_03_2012/post-50649-0-21085700-1331079268.jpg'
        song_link = 'N/A'
        popularity = '-1'
        print("----------------------------------------------------")
        print(str(station_freq))
        print('Title: ' + formatted['result']['title'] + ' Artist: ' + \
              formatted['result']['artist'])

        if 'spotify' in formatted['result']:
            album_art_link = formatted['result']['spotify']['album']['images'][0]['url']
            song_link = formatted['result']['spotify']['external_urls']['spotify']
            popularity = formatted['result']['spotify']['popularity']
        print(SONG_MEMORY)
        if str(station_freq) not in SONG_MEMORY or formatted['result']['title'] != SONG_MEMORY[str(station_freq)]:
            SONG_MEMORY[str(station_freq)] = formatted['result']['title']
            insert_into_db(formatted['result']['title'], formatted['result']['artist'],
                                     song_link,
                                     album_art_link, station_freq, popularity)
        else:
            print(formatted['result']['title'] + ' has already been added to the database.')
        print("----------------------------------------------------")

    else:
        print('No result on frequency ' + str(station_freq))


def insert_into_db(song_name, song_artist, spotify_link, album_link, station_freq, popularity):
    db = pymysql.connect(host="rds-sdr-transcriber-mysql.c9vzpejjgwtu.us-east-1.rds.amazonaws.com", user="admin", password="sdr-db-1", database="sdrtranscriberDB")
    cursor = db.cursor()
    now = datetime.datetime.now()

    # execute SQL query using execute() method.
    print('DEBUG: ' + 'INSERT INTO song_played (song_name, song_artist, yt_link, album_cover, station_freq, time_played, popularity_rating) VALUES("'+db.escape_string(s=song_name)+'", "'+db.escape_string(s=song_artist)+'", "'+spotify_link+'", "'+album_link+'", "'+str(station_freq)+'", "'+now.strftime('%Y-%m-%d %H:%M:%S')+'", "' + str(popularity) + '")')

    cursor.execute('INSERT INTO song_played (song_name, song_artist, yt_link, album_cover, station_freq, time_played, popularity_rating) VALUES("'+db.escape_string(s=song_name)+'", "'+db.escape_string(s=song_artist)+'", "'+spotify_link+'", "'+album_link+'", "'+str(station_freq)+'", "'+now.strftime('%Y-%m-%d %H:%M:%S')+'", "' + str(popularity) + '")')
    db.commit()
    cursor.close()
    # Fetch a single row using fetchone() method.

    # disconnect from server
    db.close()


def worker_transcriber(cv):
    while True:
        with cv:
            cv.wait()
        print('Transcribing.')
        text = transcriber.transcribe_text(sdrcontrol.get_recording_name(1)[0])
        transcriber.insert_transcription_into_db(text)
        os.remove(sdrcontrol.get_recording_name(1)[0])
        #if (num_transcribed > 4):
        #    transcriber.delete_oldest_transcription()


def worker_recording_transcriber(cv):
    while True:
        print('Recording new file.')
        sdrcontrol.record(True, 1)
        time.sleep(60)
        sdrcontrol.record(False, 1)
        time.sleep(1)
        with cv:
            cv.notify_all()
        print(sdrcontrol.get_recording_name(1))



def worker_music():
    while True:
        for x in FREQS:
            CURFREQ = x
            sdrcontrol.change_frequency(CURFREQ, 0)
            print('Detecting song on ' + str(CURFREQ) + '...')
            sdrcontrol.clear_recordings(0)
            time.sleep(0.5)
            sdrcontrol.record(True, 0)
            time.sleep(9)
            sdrcontrol.record(False, 0)
            time.sleep(2)
            recognize(sdrcontrol.get_recording_name(0)[0], CURFREQ)



def main():
    cv = threading.Condition()
    music_thread = threading.Thread(target=worker_music)
    sdrcontrol.record(0, 0)
    sdrcontrol.record(0, 1)
    sdrcontrol.clear_recordings(0)
    sdrcontrol.clear_recordings(1)
    sdrcontrol.change_frequency(103.9, 1)
    transcriber_thread_record = threading.Thread(target=worker_recording_transcriber, args=(cv,))
    transcriber_thread = threading.Thread(target=worker_transcriber, args=(cv,))
    music_thread.start()
    transcriber_thread.start()
    transcriber_thread_record.start()


if __name__ == '__main__':
    main()