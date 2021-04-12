const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const mysql=require('mysql');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors());

const PORT = '8001';
const HOST = '173.49.251.28';
const net = require('net');
const client = new net.Socket();
client.connect(PORT, HOST, function(){
    console.log("Connected to " + HOST + " on port " + PORT);
});

const db = mysql.createPool({
    host: "rds-sdr-transcriber-mysql.c9vzpejjgwtu.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "sdr-db-1",
    database: "sdrtranscriberDB"
});

app.get("/", (req, res) => {
    res.send("Hello World!");

});

app.get("/api/getStations", (req, res) => {
    const  getStations = `SELECT * from station ORDER BY station_freq`;
    db.query(getStations, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result);
    })
});

app.get("/api/getSongsByStation/:stationFreq", (req, res) => {
    const stationFreq = req.params.stationFreq;
    const  getSongsByStation = `SELECT * from song_played WHERE station_freq = ${stationFreq} ORDER BY time_played DESC`;
    db.query(getSongsByStation, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result);
    })
});

app.get("/api/getLatestSong", (req, res) => {
    const  getLatestSong = `SELECT * FROM song_played ORDER BY song_id DESC LIMIT 1`;
    db.query(getLatestSong, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result);
    })
});

app.get("/api/getStationGenres", (req, res) => {
    const  getStationGenres = `SELECT DISTINCT (music_genre) FROM station`;
    db.query(getStationGenres, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result);
    })
});

app.get("/api/getSongsByPopularity", (req, res) => {
    const  getSongsByPopularity = `SELECT * FROM song_played WHERE song_id IN (SELECT MAX(song_id) FROM song_played GROUP BY song_name, song_artist) AND popularity_rating >= 0 ORDER BY popularity_rating DESC LIMIT 20`;
    db.query(getSongsByPopularity, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result);
    })
});

app.get("/api/getNewsContent", (req, res) => {
    const  getNewsContent = `SELECT * FROM TranscribedSpeech`;
    db.query(getNewsContent, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result);
    })
});

app.post("/api/connectToStation", (req, res) => {
    console.log(req.body.station);
    client.write(req.body.station);
    client.on('data', function(data) {
        console.log(data.toString());
        res.send(data.toString());
        client.end();
      });
});

/*
client.write('f /x0d/x0a');
client.on('data', function(data) {
    console.log(data.toString());
    client.end();
  });
  //res.send(req.body.station);
//sending frequency 'F 102100000'
//getting frequency 'f /x0d/x0a'
*/

app.listen(3001, () => {
    console.log("SERVER IS RUNNING ON PORT 3001!");
});