import React, { useState, useEffect } from "react";
import "./homeStyle.css";
import radio from '../../images/radio.png';
import Axios from 'axios';
import { formatDate } from '../helpers/formatDate';


export default function Home() {
    const [lastSong, setLastSong] = useState();

    useEffect(() => {
        fetchLatestSong();
        const id = setInterval(fetchLatestSong, 4000);
        return () => clearInterval(id);
    }, []);

    const fetchLatestSong = () => {
        Axios.get("http://localhost:3001/api/getLatestSong").then((response) => {
            const data = response.data;
            if (data.length > 0) {
                data.forEach(element => {
                    const newDate = formatDate(element.time_played);
                    const parsed = newDate.split(' ');
                    element.time_played = parsed[parsed.length - 1];
                });
            }
            console.log(data);
            setLastSong(data);
        }).catch((error) => {
            console.log(error);
        })
    };

    return (
        <div className="home">
            {lastSong && <div className="banner">
                {lastSong[0].song_name} by {lastSong[0].song_artist} started playing on station {lastSong[0].station_freq} at {lastSong[0].time_played}
            </div>}
            <h1 className="heading">No radio No problem</h1>
            <h3 className="paragraph">Enjoy and explore all the content from the radio stations of Philadelphia right here!</h3>
            <img className="icon" src={radio} alt="home page icon" />
        </div>
    )
}

