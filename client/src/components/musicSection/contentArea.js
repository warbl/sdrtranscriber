import React, { useState, useEffect } from "react";
import { Form } from 'react-bootstrap';
import Axios from 'axios';
import "./musicSection.css";


export default function ContentArea({ station }) {
    const [songs, setSongs] = useState([]);
    const [filterResults, setFilterResults] = useState([]);


    useEffect(() => {
        fetchSongsByStation();
        const id = setInterval(fetchSongsByStation, 30000);
        return () => clearInterval(id);
    }, [station]);

    const fetchSongsByStation = () => {
        const stationFreq = station.station_freq;
        Axios.get("http://localhost:3001/api/getSongsByStation/" + stationFreq).then((response) => {
            console.log("getting songs from station: " + station.station_freq);
            const data = response.data;
            if (data.length > 0) {
                data.forEach(element => {
                    const newDate = formatDate(element.time_played);
                    element.time_played = newDate;
                });
            }
            console.log(data);
            setSongs(data);
            setFilterResults(data);
        }).catch((error) => {
            console.log(error);
        })
    };

    const formatDate = (oldDate) => {
        var tmpDate = new Date(oldDate).toDateString();
        var tmpTime = new Date(oldDate).toTimeString().split(' ')[0];
        var hours = tmpTime.split(':')[0];
        var minutes = tmpTime.split(':')[1];
        // calculate
        var timeValue;
        if (hours > 0 && hours <= 12) {
            timeValue = "" + hours;
        } else if (hours > 12) {
            timeValue = "" + (hours - 12);
        } else if (hours == 0) {
            timeValue = "12";
        }
        timeValue += ":" + minutes;  // get minutes
        timeValue += (hours >= 12) ? "pm" : "am";  // get AM/PM

        return tmpDate + ' at ' + timeValue;

    }

    const search = (e) => {
        const search = e.target.value;
        const result = songs.filter(value => value.song_name.toLowerCase().includes(search.toLowerCase()) || value.song_artist.toLowerCase().includes(search));
        setFilterResults(result);
    };

    return (
        <>
            <div className="container">
                <h1 className="stationHeading"> {station.station_name} - {station.station_freq} SET LIST </h1>
                {songs.length > 0 &&
                    <div>
                        <Form className="filter-form-songs">
                            <Form.Group className="filter-form-song-box">
                                <Form.Control onChange={search} className='filter-form-song-input' type="text" placeholder=" Search songs..." />
                            </Form.Group>
                        </Form>
                    </div>
                }
                {filterResults.length <= 0 ? (
                    <div className="empty_song_container">
                        <span>¯\_(ツ)_/¯</span>
                        <p>Sorry no songs could be found</p>
                    </div>
                ) : (
                        <div className="song_container" id='scrollbar'>
                            {filterResults && filterResults.map((val, index) => {
                                return (
                                    <div className="song" key={val.song_id}>
                                        <div className="album-image">
                                            <img src={val.album_cover} alt="album_image" />
                                        </div>
                                        <div className="song-info">
                                            <h1>{index + 1}. {val.song_name}</h1>
                                            <h3>Artist: {val.song_artist}</h3>
                                            <h3>Played on: {val.time_played}</h3>
                                            <a href={val.yt_link} target="_blank" rel="noreferrer" className="yt-link">Listen to Song HERE</a>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
            </div>
        </>
    )
}
