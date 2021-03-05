const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const mysql=require('mysql');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors());


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
    const  getStations = `SELECT * from station`;
    db.query(getStations, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result);
    })
});

//probably dont need this
app.get("/api/getSongs", (req, res) => {
    const  getSongs = `SELECT * from song_played`;
    db.query(getSongs, (err, result) => {
        console.log(result);
        res.send(result);
    })
});

app.get("/api/getSongsByStation/:stationFreq", (req, res) => {
    const stationFreq = req.params.stationFreq;
    const  getSongsByStation = `SELECT * from song_played WHERE station_freq = '${stationFreq}'`;
    db.query(getSongsByStation, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result);
    })
});

app.post("/api/insertSong",  (req, res) => {
    const stationFreq = req.body.stationFreq;
    const songName = req.body.songName;
    const songArtist = req.body.songArtist;
    const albumCover = req.body.albumCover;
    const yt_link= req.body.yt_link;
    const timePlayed = req.body.timePlayed; // format (yyyy-mm-dd hh:mm:ss)

    const  insertSong = `INSERT INTO song_played (song_name, song_artist, yt_link, album_cover, station_freq, recent_time_played) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE recent_time_played = '${timePlayed}'`;
    db.query(insertSong, [songName, songArtist, yt_link, albumCover, stationFreq, timePlayed ], (err, result) => {
        console.log(err);
        console.log(result);
        res.send(result);
    })
    
});

app.listen(3001, () => {
    console.log("SERVER IS RUNNING ON PORT 3001!");
})
