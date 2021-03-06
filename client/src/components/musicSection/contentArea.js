import React, {useState, useEffect} from "react";
import Axios from 'axios';
import "./musicSection.css";


export default function ContentArea({station}){
    const [songs, setSongs] = useState([]);

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
        }).catch((error) => {
            console.log(error);
        });
    }; 

    return(
        <>
        {songs.length <= 0 ? (
             <div className="container">
                 <div className="empty_song_container">
                     <span>¯\_(ツ)_/¯</span>
                     <p>Sorry no songs could be found</p>
                </div>
            </div>
        ) : (
            <div className="container">
            <div className="song_container" id='scrollbar'>
                    <h1 className="stationHeading"> {station.station_name} - {station.station_freq} SET LIST </h1>
                    {songs && songs.map((val) => {
                        return(
                        <div className="song" key={val.song_id}>
                            <h3 key={val.song_id} id={val.song_id}>{val.song_name}</h3>
                        </div>
                    )
                })} 
            </div>
            </div>
        )}
        </>
    )
}
