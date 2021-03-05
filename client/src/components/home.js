import React, {useState, useEffect} from "react";
import Axios from 'axios';

export default function Home(){
    const [stationList, setStationList] = useState();
    
    useEffect(() => {
        getStations();
    }, []);

    const getStations = () => {
        Axios.get("http://localhost:3001/api/getStations").then((response) => {
            console.log(response.data);
            setStationList(response.data);
        }).catch((error) => {
            console.log(error);
        });
    };

    const getSongsByStation = (val) => {
        const stationName = val.station_name
        Axios.get("http://localhost:3001/api/getSongsByStation/" + stationName).then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        });
    };
    
    return(
        <div className="home">
           <h1>SDR Receiver Website</h1>
           <h3>Radio Stations from DB</h3>
           <ul>
            {stationList && stationList.map((val) => {
                return (
                <div key={val.song_id}>
                <button key={val.song_id} onClick={() => {getSongsByStation(val)}}>Click ME TO GET SONG INFO</button>&ensp;
                Station: {val.station_name}
                </div>)
            })}
            </ul>
        </div>
    )
}