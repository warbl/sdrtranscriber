import requests
import sys
import time
import requests
import pymysql
import datetime


def read_file(filename, chunk_size=5242880):
    with open(filename, 'rb') as _file:
        while True:
            data = _file.read(chunk_size)
            if not data:
                break
            yield data


def insert_transcription_into_db(text):
    db = pymysql.connect(host="rds-sdr-transcriber-mysql.c9vzpejjgwtu.us-east-1.rds.amazonaws.com", user="admin", password="sdr-db-1", database="sdrtranscriberDB")
    cursor = db.cursor()
    now = datetime.datetime.now()

    # execute SQL query using execute() method.
    print('DEBUG: ' + 'INSERT INTO TranscribedSpeech (time_of_broadcast, transcribed_speech ) VALUES("'+now.strftime('%Y-%m-%d %H:%M:%S')+ '", "'+ text+'")')

    cursor.execute('INSERT INTO TranscribedSpeech (time_of_broadcast, transcribed_speech ) VALUES("'+now.strftime('%Y-%m-%d %H:%M:%S')+ '", "'+ text+'")')
    db.commit()
    cursor.close()
    # Fetch a single row using fetchone() method.

    # disconnect from server
    db.close()
    
def delete_oldest_transcription():
    db = pymysql.connect(host="rds-sdr-transcriber-mysql.c9vzpejjgwtu.us-east-1.rds.amazonaws.com", user="admin", password="sdr-db-1", database="sdrtranscriberDB")
    cursor = db.cursor()
    print('DEBUG: ' + 'DELETE FROM TranscribedSpeech WHERE time_of_broadcast IN (SELECT time_of_broadcast from TranscribedSpeech ORDER BY time_of_broadcast ASC LIMIT 1)')
    cursor.execute('SELECT time_of_broadcast from TranscribedSpeech ORDER BY time_of_broadcast ASC LIMIT 1;')
    result = cursor.fetchone()
    cursor.execute('DELETE FROM TranscribedSpeech WHERE time_of_broadcast = \'' + result[0].strftime('%Y-%m-%d %H:%M:%S') + '\';')
    db.commit()
    cursor.close()
    db.close()

def transcribe_text(filename):
    headers = {'authorization': "8becf1e1a8d54053bc524924c012d8be"}
    response = requests.post('https://api.assemblyai.com/v2/upload',
                             headers=headers,
                             data=read_file(filename))

    data = (response.json()['upload_url'])

    json = {
        "audio_url": data
    }

    headers = {
        "authorization": "8becf1e1a8d54053bc524924c012d8be",
        "content-type": "application/json"
    }

    response = requests.post("https://api.assemblyai.com/v2/transcript", json=json, headers=headers)

    id = response.json()['id']

    endpoint = "https://api.assemblyai.com/v2/transcript/" + id

    while True:
        response = requests.get(endpoint, headers=headers)
        process = response.json()['status']
        if process == 'completed':
            return (response.json()['text'])


