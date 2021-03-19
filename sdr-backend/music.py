import os, sys
import requests
from acrcloud.recognizer import ACRCloudRecognizer


def musicRecog(music):
    data = {
        'api_token': 'a7be9aa12f182b7ef4ad00ae7a7d8026',
        'return': 'spotify',
    }
    files = {
        'file': open('output.wav','rb'),
    }
    result = requests.post('https://api.audd.io/', data=data, files=files)
    return result.text

"""
def musicRecog (music):
    config = {
        #Replace "xxxxxxxx" below with your project's host, access_key and access_secret.
        'host':'identify-us-west-2.acrcloud.com',
        'access_key':'939e967af1cdba363d503ff9396e0b5f', 
        'access_secret':'F2InWkrpw4lzaqKXHpnsB4djaDDJPxtSff5ST6nN',
        'timeout':10 # seconds
    }

    '''This module can recognize ACRCloud by most of audio/video file. 
        Audio: mp3, wav, m4a, flac, aac, amr, ape, ogg ...
        Video: mp4, mkv, wmv, flv, ts, avi ...'''
    re = ACRCloudRecognizer(config)

    #recognize by file path, and skip 0 seconds from from the beginning of sys.argv[1].
    return re.recognize_by_file(music, 0)
"""
