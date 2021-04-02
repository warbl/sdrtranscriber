import React, { useState, useEffect } from "react";
import { Form } from 'react-bootstrap';
import Axios from 'axios';
import "./musicSection.css";
import { formatDate } from '../helpers/formatDate';


export default function ContentArea({ station }) {
    const [songs, setSongs] = useState([]);
    const [filterResults, setFilterResults] = useState([]);
    let songSize = 0;
    const [showBanner, setShowBanner] = useState(false);
    const [input, setInput] = useState();


    useEffect(() => {
        fetchSongsByStation();
        const id = setInterval(fetchSongsByStation, 5000);
        return () => clearInterval(id);
    }, [station]);

    const fetchSongsByStation = () => {
        const stationFreq = station.station_freq;
        Axios.get("https://sdrtranscriber.tk:3002/api/getSongsByStation/" + stationFreq).then((response) => {
            console.log("getting songs from station: " + station.station_freq);
            const data = response.data;
            if (data.length > 0) {
                data.forEach(element => {
                    const newDate = formatDate(element.time_played);
                    element.time_played = newDate;
                });
            }
            if (songSize === 0) {
                songSize = data.length;
                setSongs(data);
                setFilterResults(data);
                return;
            } else if (songSize > 0 && songSize < data.length) {
                console.log("new song added");
                setInput('');
                setShowBanner(true);
                songSize = data.length;
                setSongs(data);
                setFilterResults(data);
            }
        }).catch((error) => {
            console.log(error);
        })
    };

    const search = (e) => {
        const search = e.target.value;
        const result = songs.filter(value => value.song_name.toLowerCase().includes(search.toLowerCase()) || value.song_artist.toLowerCase().includes(search));
        setFilterResults(result);
    };

    return (
        <>
            <div className="container" style={{ height: showBanner ? '82%' : '87%' }}>
                {showBanner === true && <div className="banner">
                    <span className="banner-content">New song just added. Check it out below!</span>
                    <span className="close-button" onClick={() => { setShowBanner(false) }}>&#x2715;</span>
                </div>}
                <h1 className="stationHeading"> {station.station_name} - {station.station_freq} SET LIST </h1>
                {songs.length > 0 &&
                    <div>
                        <Form className="filter-form-songs">
                            <Form.Group className="filter-form-song-box">
                                <Form.Control className='filter-form-song-input' type="text" placeholder=" Search songs..." value={input} onChange={(e) => { setInput(e.target.value); search(e) }} />
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
                        <div className="song_container">
                            {filterResults && filterResults.map((val, index) => {
                                return (
                                    <div className="song" key={val.song_id}>
                                        <div className="song-info">
                                            <div className="song-content">
                                                <h1>{index + 1}. {val.song_name}</h1>
                                                <h3>Artist: {val.song_artist}</h3>
                                                <h3>Played on: {val.time_played}</h3>
                                            </div>
                                            <div className="album-image">
                                                <img src={val.album_cover} alt="album_image" />
                                            </div>
                                        </div>
                                        {val.yt_link !== 'N/A' && <div className="playback">
                                            <iframe src={[val.yt_link.slice(0, 24), '/embed', val.yt_link.slice(24)].join('')} height="75" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                                        </div>
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    )}
            </div>
        </>
    )
}
