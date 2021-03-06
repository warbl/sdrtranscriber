import React, {useState, useEffect} from "react";
import {Form} from 'react-bootstrap';
import Axios from 'axios';
import "./musicSection.css";


export default function ContentArea({station}){
    const [songs, setSongs] = useState([]);
    const [filterResults, setFilterResults] = useState([]);

    useEffect(() => {
        getSongsByStation(station);
    }, [station]);

    const getSongsByStation = (station) => {
        const stationFreq = station.station_freq
        console.log(stationFreq);
        Axios.get("http://localhost:3001/api/getSongsByStation/" + stationFreq).then((response) => {
            console.log("getting songs from station: " + stationFreq);
            console.log(response.data);
            setSongs(response.data);
            setFilterResults(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }; 

    const search = (e) => {
        const search = e.target.value;
        console.log(search);
        const result = songs.filter(value =>  value.song_name.toLowerCase().includes(search.toLowerCase()) || value.song_artist.toLowerCase().includes(search));
        setFilterResults(result);
    };

    return(
        <>
        <div className="container">
        <h1 className="stationHeading"> {station.station_name} - {station.station_freq} SET LIST </h1>
        {songs.length > 0 &&
        <Form className="filter-form-songs">
                <Form.Group className="filter-form-song-box">
                    <Form.Control onChange={search} className='filter-form-song-input' type="text" placeholder=" Search songs..." />
                </Form.Group>
            </Form>
            }
        {filterResults.length <= 0 ? (
                 <div className="empty_song_container">
                     <span>¯\_(ツ)_/¯</span>
                     <p>Sorry no songs could be found</p>
                </div>
        ) : (
            <div className="song_container" id='scrollbar'>
                    {filterResults && filterResults.map((val) => {
                        return(
                        <div className="song" key={val.song_id}>
                            <div className="album-image" key={val.song_id}>
                                <img src={val.album_cover} alt="album_image"/>
                            </div>
                            <div className="song-info">
                            <h1 key={val.song_id} id={val.song_id}>{val.song_name}</h1>
                            <h3 key={val.song_id} id={val.song_id}>Artist: {val.song_artist}</h3>
                            <h3 key={val.song_id} id={val.song_id}>Played on: {val.time_played}</h3>
                            <a href={val.yt_link} target="_blank">Listen to Song HERE</a>
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
