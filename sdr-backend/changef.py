import json
import requests


def cf(frequency):
	freq = frequency * 1000000
	submitreq(freq)

def askdbpower():
	r = requests.get('http://127.0.0.1:8091/sdrangel/deviceset/0/channels/report')
	dbpower = json.loads(r.content)
	return float(dbpower['channels'][0]['report']['BFMDemodReport']['channelPowerDB'])

def submitreq(freq):
	x = {
	"deviceHwType" : "RTLSDR",
	"direction" : 0,
	"rtlSdrSettings" : {
		"centerFrequency" : freq
		}
	}
	json_data = json.dumps(x)
	r = requests.patch('http://127.0.0.1:8091/sdrangel/deviceset/0/device/settings', data=json_data)
