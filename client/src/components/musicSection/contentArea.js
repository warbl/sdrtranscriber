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


    useEffect(() => {
        fetchSongsByStation();
        const id = setInterval(fetchSongsByStation, 5000);
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
            setSongs(data);
            setFilterResults(data);
            if(songSize === 0){
                songSize = data.length;
                return;
            }else if(songSize > 0 && songSize < data.length){
                console.log("new song added");
                setShowBanner(true);
                songSize = data.length;
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
            <div className="container">
                <h1 className="stationHeading"> {station.station_name} - {station.station_freq} SET LIST </h1>
                {showBanner === true && <div className="banner">
                    <span className="banner-content">New song just added! Check it out below.</span>
                    <span className="close-button" onClick={() => { setShowBanner(false)}}>X</span>
                </div>}
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
										<div className ="playback">
											<iframe src={val.yt_link} width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
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
