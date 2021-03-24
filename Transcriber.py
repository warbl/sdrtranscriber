import requests
import sys
import time
import requests

filename = "./SDRSharp_20210319_182504Z_103900000Hz_AF.wav"


def read_file(filename, chunk_size=5242880):
    with open(filename, 'rb') as _file:
        while True:
            data = _file.read(chunk_size)
            if not data:
                break
            yield data


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

print(txt)
print('done')
exit()