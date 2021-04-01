import React, { useState, useEffect } from "react";
import Axios from 'axios';
import './radio.css'


export default function Radio() {
    const [stationList, setStationList] = useState();
    const [stationGenres, setStationGenres] = useState();
    const [loadingStation, setLoadingStation] = useState(false);
    const [genre, setGenre] = useState();
    const [filterResults, setFilterResults] = useState();
    const [station, setStation] = useState();
    const [livestreamLink, setLivestreamLink] = useState();

    useEffect(() => {
        fetchStations();
        fetchStationGenres();
    }, []);

    const fetchStations = async () => {
        Axios.get("http://localhost:3001/api/getStations").then((response) => {
            console.log(response.data);
            setStationList(response.data);
            setFilterResults(response.data);
        }).catch((error) => {
            console.log(error);
        });
    };

    const fetchStationGenres = async () => {
        Axios.get("http://localhost:3001/api/getStationGenres").then((response) => {
            console.log(response.data);
            if (response.data.length > 0) {
                let allGenres = [];
                response.data.forEach(element => {
                    const genres = element.music_genre.split(',');
                    genres.forEach(genre => {
                        allGenres.push(genre);
                    })
                });
                setStationGenres(allGenres);
            }
        }).catch((error) => {
            console.log(error);
        });
    };

    const search = (e) => {
        const search = e.target.value.toString();
        if (genre.toLowerCase() === "all genres") {
            console.log("here");
            const result = stationList.filter(value => value.station_name.toLowerCase().includes(search.toLowerCase()) || value.station_freq.toString().includes(search));
            setFilterResults(result);
        } else {
            const result = stationList.filter(value => (value.station_name.toLowerCase().includes(search.toLowerCase()) || value.station_freq.toString().includes(search)) && value.music_genre.toLowerCase().includes(genre.toLowerCase()));
            setFilterResults(result);
        }
    };

    const filterbyGenre = (e) => {
        const search = e.target.value;
        console.log(search);
        if (search.toLowerCase() === "all genres") {
            const result = stationList.filter(value => value.station_name.toLowerCase().includes(input.toLowerCase()) || value.station_freq.toString().includes(input));
            setFilterResults(result);
        } else {
            const result = stationList.filter(value => value.music_genre.toLowerCase().includes(search.toLowerCase()) && (value.station_name.toLowerCase().includes(input.toLowerCase()) || value.station_freq.toString().includes(input)));
            setFilterResults(result);
        }
    };

    const clickStation = (e) => {
        setStation(val);
        setLivestreamLink(null);
    }

    const tuneToStation = () => {
        setLoadingStation(true);
        //send station name to api
        //poll other api until you receive a livestream link back
        // setLivestreamLink(response.data);
        setLoadingStation(false);
    }

    const removeStation = (e) => {
        setStation(null);
    }

    const stopStream = () => {
        setLivestreamLink(null);
        setStation(null);
    }

    return (
        <div className="radio">
            {!station && !livestreamLink && <h1 className="title">Choose a Station</h1>}
            {(station && !livestreamLink) &&
                <div className="select-station">
                    <h3>Listen to station: {station.station_name} - {station.station_freq}?</h3>
                    {!loadingStation && <button onClick={() => removeStation()}>X</button>}
                    {!loadingStation && <button onClick={() => tuneToStation()}>Connect</button>}
                    {loadingStation && <div>Connecting...</div>}
                </div>}
            {livestreamLink &&
                <div className="livestream container">
                    <h1 className="livestream-title">Listening to {station.station_name} - {station.station_freq}</h1>
                    <button onClick={() => stopStream()}>Disconnect</button>
                    <div className="playback">
                        <audio controls autoPlay>
                            <source src={livestreamLink} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
                    </div>
                </div>}
            <div className="station_container">
                {filterResults && filterResults.map((val) => {
                    return (
                        <div className="station" key={val.station_id} onClick={() => clickStation(val)}>
                            <h3 className="station_name">{val.station_name}</h3>
                            <span className="station_freq">({val.station_freq})</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}