import requests
import sys
import time
import requests
import pymysql
import datetime

filename = ""


def read_file(filename, chunk_size=5242880):
    with open(filename, 'rb') as _file:
        while True:
            data = _file.read(chunk_size)
            if not data:
                break
            yield data

def insert_into_db(text):
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





def main():


    headers = {'authorization': "8becf1e1a8d54053bc524924c012d8be"}
    response = requests.post('https://api.assemblyai.com/v2/upload',
                         headers=headers,
                         data=read_file(filename))

    data = (response.json()['upload_url'])



    endpoint = "https://api.assemblyai.com/v2/transcript"

    json = {
    "audio_url": data
    }

    headers = {
        "authorization": "8becf1e1a8d54053bc524924c012d8be",
        "content-type": "application/json"
    }

    response = requests.post(endpoint, json=json, headers=headers)


    id= response.json()['id']

    endpoint = "https://api.assemblyai.com/v2/transcript/" + id

    headers = {
        "authorization": "8becf1e1a8d54053bc524924c012d8be",
    }



    response = requests.get(endpoint, headers=headers)
    proces = response.json()['status']
    txt=''
    while True:
        response = requests.get(endpoint, headers=headers)
        proces = response.json()['status']
        txt = (response.json()['text'])
        if proces == 'completed':
            break

    insert_into_db(txt)
    print('done')
    exit()