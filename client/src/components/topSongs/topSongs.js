import React, { useState, useEffect } from "react";
import { Form } from 'react-bootstrap';
import Axios from 'axios';
import { formatDate } from '../helpers/formatDate';
import "./topSongs.css";


export default function TopSongs() {
    const [topSongs, setTopSongs] = useState();
    const [filterResults, setFilterResults] = useState();
    const [input, setInput] = useState('');

    useEffect(() => {
        fetchTopSongs();
        const id = setInterval(fetchTopSongs, 300000);
        return () => clearInterval(id);
    }, []);

    const fetchTopSongs = () => {
        Axios.get("https://sdrtranscriber.tk:3002/api/getSongsByPopularity").then((response) => {
            const data = response.data;
            if (data.length > 0) {
                data.forEach(element => {
                    const newDate = formatDate(element.time_played);
                    const parsed = newDate.split(' ');
                    element.time_played = parsed[parsed.length - 1];
                });
            }
            setInput('');
            setTopSongs(data);
            setFilterResults(data);
        }).catch((error) => {
            console.log(error);
        })
    };

    const search = (e) => {
        const search = e.target.value;
        const result = topSongs.filter(value => value.song_name.toLowerCase().includes(search.toLowerCase()) || value.song_artist.toLowerCase().includes(search));
        setFilterResults(result);
    };

    return (
        <div className="container">
            <h1 className="heading">Here are the Most Popular Songs Played on Philadelphia Radio</h1>
            <div>
                <Form className="filter-form-songs">
                    <Form.Group className="filter-form-song-box">
                        <Form.Control className='filter-form-song-input' type="text" value={input} placeholder=" Search songs..." onChange={(e) => { setInput(e.target.value); search(e) }} />
                    </Form.Group>
                </Form>
            </div>
            <div className="top-songs-container">
                {filterResults && filterResults.map((val, index) => {
                    return (
                        <div className="song" key={val.song_id} data-testid={'song_id_' + index}>
                            <div className="song-info">
                                <div className="song-content">
                                    <h1 data-testid={'song_name_' + index}>{index + 1}. {val.song_name}</h1>
                                    <h3 data-testid={'song_artist_' + index}>Artist: {val.song_artist}</h3>
                                    <h3 data-testid={'station_freq_' + index}>Played on: {val.station_freq}</h3>
                                </div>
                                <div className="album-image" data-testid={'album_cover_' + index}>
                                    <img src={val.album_cover} alt="album_image" />
                                </div>
                            </div>
                            <div className="playback" data-testid={'yt_link_' + index}>
                                <iframe title={val.song_name} src={[val.yt_link.slice(0, 24), '/embed', val.yt_link.slice(24)].join('')} width="300" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
