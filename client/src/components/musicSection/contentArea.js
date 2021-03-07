import React, {useState, useEffect} from "react";
import {Form} from 'react-bootstrap';
import Axios from 'axios';
import "./musicSection.css";


export default function ContentArea({station}){
    const [songs, setSongs] = useState([]);
    const [filterResults, setFilterResults] = useState([]);

    useEffect(() => {
        fetchSongsByStation(station);
    }, [station]);

    const fetchSongsByStation = (station) => {
        console.log(station);
        const stationFreq = station.station_freq
        Axios.get("http://localhost:3001/api/getSongsByStation/" + stationFreq).then((response) => {
            console.log("getting songs from station: " + stationFreq);
            const data = response.data;
            if(data.length > 0){
            data.forEach(element => {
                const newDate = formatDate(element.time_played);
                element.time_played = newDate;
                console.log(element);
            });
        }
        setSongs(data);
        setFilterResults(data);
        //sleep();
        }).catch((error) => {
            console.log(error);
        });
    }; 

    const formatDate = (oldDate) => {
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const data = oldDate.split("T");
        //date
        let date = data[0].split("-");
        const year = date[0];
        const month = months[parseInt(date[1])-1];
        const day = date[2];
        date = month + " " + day + " " + year;
        //time
        let time = data[1].split(":");
        let hour = parseInt(time[0]);
        let pm = false;
        if(hour > 12){
            pm = true;
            hour = hour - 12;
        }
        const minutes = time[1];
        time = hour + ":" + minutes;
        (pm === false) ? time = time + " am" : time = time + "pm";
        //putting back together
        return date + " at " + time;
    }

    /*
    const sleep = async() => {
        const tempStation = station;
        await new Promise(r => setTimeout(r, 60000));
        console.log("slept!");
        fetchSongsByStation(tempStation);
    }
    */

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
                            <div className="album-image">
                                <img src={val.album_cover} alt="album_image"/>
                            </div>
                            <div className="song-info">
                            <h1>{val.song_name}</h1>
                            <h3>Artist: {val.song_artist}</h3>
                            <h3>Played on: {val.time_played}</h3>
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
