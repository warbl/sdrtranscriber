import React, { useState, useEffect } from "react";
import "./topSongs.css";
import Axios from 'axios';
import { formatDate } from '../helpers/formatDate';


export default function TopSongs() {
    const [topSongs, setTopSongs] = useState();

    useEffect(() => {
        fetchTopSongs();
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
            setTopSongs(data);
        }).catch((error) => {
            console.log(error);
        })
    };

    return (
        <div className="topSongsArea">
            <h1 className="heading">Here are the Most Popular Songs Played on Philadelphia Radio</h1>
            {topSongs &&
                <div className="song-container">
                    {topSongs && topSongs.map((val, index) => {
                        return (
                            <div className="song" key={val.song_id}>
                                <h1>{index + 1}. {val.song_name}</h1>
                            </div>
                        )
                    })}

                </div>}
        </div>
    )
}
