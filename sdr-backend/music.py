import os, sys
import requests
#from acrcloud.recognizer import ACRCloudRecognizer


def musicRecog(music):
    data = {
        'api_token': '',
        'return': 'spotify',
    }
    files = {
        'file': open(music,'rb'),
    }
    result = requests.post('https://api.audd.io/', data=data, files=files)
    return result.text

"""
def musicRecog (music):
    config = {
        #Replace "xxxxxxxx" below with your project's host, access_key and access_secret.
        'host':'identify-us-west-2.acrcloud.com',
        'access_key':'', 
        'access_secret':'',
        'timeout':10 # seconds
    }

    '''This module can recognize ACRCloud by most of audio/video file. 
        Audio: mp3, wav, m4a, flac, aac, amr, ape, ogg ...
        Video: mp4, mkv, wmv, flv, ts, avi ...'''
    re = ACRCloudRecognizer(config)

    #recognize by file path, and skip 0 seconds from from the beginning of sys.argv[1].
    return re.recognize_by_file(music, 0)
"""
