import json
import requests
import socket
import os
import glob

def change_frequency(frequency, index):
	freq = frequency * 1000000
	s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	s.connect(('127.0.0.1', 8000+index))
	s.send(b'F ' + bytes(str(freq), 'UTF-8'))
	s.close()


def record(state, index):
	s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	s.connect(('127.0.0.1', 8000+index))
	if state == True:
		s.send(b'AOS')
	else:
		s.send(b'LOS')
	s.close()


def clear_recordings(index):
	os.system('rm -rf /home/laserball31/recordings/' + str(index) + '/*')


def get_recording_name(index):
	return sorted(glob.glob('/home/laserball31/recordings/' + str(index) + '/*.wav'), key=os.path.getmtime)


"""
def askdbpower():
	r = requests.get('http://127.0.0.1:8091/sdrangel/deviceset/0/channels/report')
	dbpower = json.loads(r.content)
	return float(dbpower['channels'][0]['report']['BFMDemodReport']['channelPowerDB'])


def submit_req(freq, index, hackrf=False):
	if not hackrf:
		x = {
		"deviceHwType" : "RTLSDR",
		"direction" : 0,
		"rtlSdrSettings" : {
			"centerFrequency" : freq
			}
		}
	else:
		x = {
			"deviceHwType": "RTLSDR",
			"direction": 0,
			"rtlSdrSettings": {
				"centerFrequency": freq
			}
		}
	json_data = json.dumps(x)
	requests.patch('http://127.0.0.1:8091/sdrangel/deviceset/' + index + '/device/settings', data=json_data)
"""