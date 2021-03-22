import React, { useState, useEffect } from "react";
import { Form } from 'react-bootstrap';
import Axios from 'axios';
import { formatDate } from '../helpers/formatDate';
import "./musicSection.css";


export default function TopSongs() {
    const [topSongs, setTopSongs] = useState();
    const [filterResults, setFilterResults] = useState();
    const [input, setInput] = useState();

    useEffect(() => {
        fetchTopSongs();
        const id = setInterval(fetchTopSongs, 300000);
        return () => clearInterval(id);
    }, []);

    const fetchTopSongs = () => {
        Axios.get("http://localhost:3001/api/getSongsByPopularity").then((response) => {
            const data = response.data;
            if (data.length > 0) {
                data.forEach(element => {
                    const newDate = formatDate(element.time_played);
                    const parsed = newDate.split(' ');
                    element.time_played = parsed[parsed.length - 1];
                });
            }
            console.log(data);
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
                        <Form.Control className='filter-form-song-input' type="text" placeholder=" Search songs..." value={input} onChange={(e) => {setInput(e.target.value); search(e)}}/>
                    </Form.Group>
                </Form>
            </div>
                <div className="top-songs-container">
                    {filterResults && filterResults.map((val, index) => {
                        return (
                            <div className="song" key={val.song_id}>
                                <div className="song-info">
                                    <h1>{index + 1}. {val.song_name}</h1>
                                    <h3>Artist: {val.song_artist}</h3>
                                    <h3>Played on: {val.station_freq}</h3>
                                    <div className="playback">
                                        <iframe src={[val.yt_link.slice(0, 24), '/embed', val.yt_link.slice(24)].join('')} height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                                    </div>
                                </div>
                                <div className="album-image">
                                    <img src={val.album_cover} alt="album_image" />
                                </div>
                            </div>
                        )
                    })}
                </div>
        </div>
    )
}
