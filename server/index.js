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
        res.send(result);
    })
});

app.get("/api/getSongs", (req, res) => {
    const  getSongs = `SELECT * from song_played`;
    db.query(getSongs, (err, result) => {
        console.log(result);
        res.send(result);
    })
});

app.get("/api/getSongsByStation/:stationName", (req, res) => {
    const stationName = req.params.stationName;
    const  getSongsByStation = `SELECT * from song_played WHERE station_name = '${stationName}'`;
    db.query(getSongsByStation, (err, result) => {
        console.log(result);
        res.send(result);
    })
});

const getDate = () => {
    var date = new Date();
    var aaaa = date.getFullYear();
    var gg = date.getDate();
    var mm = (date.getMonth() + 1);

    if (gg < 10)
        gg = "0" + gg;
    if (mm < 10)
        mm = "0" + mm;

    var cur_day = aaaa + "-" + mm + "-" + gg;
    var hours = date.getHours()
    var minutes = date.getMinutes()
    var seconds = date.getSeconds();

    if (hours < 10)
        hours = "0" + hours;
    if (minutes < 10)
        minutes = "0" + minutes;
    if (seconds < 10)
        seconds = "0" + seconds;

    return cur_day + " " + hours + ":" + minutes + ":" + seconds;
}

app.post("/api/insertSong",  (req, res) => {
    const stationName = req.body.stationName;
    const songName = req.body.songName;
    const songArtist = req.body.songArtist;
    const yt_link= req.body.yt_link;
    //const timePlayed = req.body.timePlayed;

    const timePlayed = getDate();
    const  insertSong = `INSERT INTO song_played (song_name, song_artist, yt_link, station_name, recent_time_played) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE recent_time_played = '${timePlayed}'`;
    db.query(insertSong, [songName, songArtist, yt_link, stationName, timePlayed ], (err, result) => {
        console.log(err);
        console.log(result);
        res.send(result);
    })
    
});

app.listen(3001, () => {
    console.log("SERVER IS RUNNING ON PORT 3001!");
})
