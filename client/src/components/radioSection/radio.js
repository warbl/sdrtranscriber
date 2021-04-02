import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner} from "@fortawesome/free-solid-svg-icons";
import { Form } from 'react-bootstrap';
import Axios from 'axios';
import './radio.css'


export default function Radio() {
    const [stationList, setStationList] = useState();
    const [stationGenres, setStationGenres] = useState();
    const [loadingStation, setLoadingStation] = useState(false);
    const [livestream, setLivestream] = useState(false);
    const [genre, setGenre] = useState();
    const [filterResults, setFilterResults] = useState();
    const [station, setStation] = useState();
    const [input, setInput] = useState('');
    const [hideSidebar, setHideSidebar] = useState(false);

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

    const clickStation = (val) => {
        setStation(val);
    }

    const tuneToStation = () => {
        setLoadingStation(true);
        //send station name to api
        //poll other api until you receive a livestream link back
        // setLivestreamLink(response.data);
        setLoadingStation(false);
        setLivestream(true);
    }

    const removeStation = () => {
        setStation(null);
    }

    const stopAudio = () => {
        const audio = document.getElementById("audio");
        audio.pause();
        audio.currentTime = 0;
        setStation(null);
        setLivestream(false);
    }

    const ReadyToPlay = (e) => {
        document.getElementById("livestream-container").style.display("show");
        document.getElementById("loading-container").style.display("none");

    }

    return (
        <div className="radio">
            <div className="sidePanel">
                <div className="side-nav-bar">
                    <Form className="filter-form-stations">
                        <Form.Group className="filter-form-station-box">
                            <Form.Control className='filter-form-station-input' type="text" placeholder=" Search stations..." value={input} onChange={(e) => { setInput(e.target.value); search(e) }} />
                        </Form.Group>
                        {stationGenres && <Form.Group>
                            <select type="text" className="filter-form_dropdown" value={genre} onChange={(e) => { setGenre(e.target.value); filterbyGenre(e) }}>
                                <option value={"all genres"}>All Genres</option>
                                {stationGenres && stationGenres.map((val, index) => {
                                    return (
                                        <option key={index} value={val}>{val}</option>
                                    )
                                })}
                            </select>
                        </Form.Group>}
                    </Form>
                    <div className="list_container">
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
            </div>
            <div className="find-song-container">
                {!station && <h1 className="title">Choose a Station</h1>}
                {station && !livestream &&
                    <div className="select-station">
                        <h3>Listen to station: {station.station_name} - {station.station_freq}?</h3>
                        <button onClick={() => removeStation()}>Cancel</button>
                        <button onClick={() => tuneToStation()}>Connect</button>
                    </div>}
                {station && livestream &&
                    <div className="play-song-container">
                        <div className="loading-container">
                                Connecting to Station...
                                <FontAwesomeIcon icon={faSpinner} class="fa-pulse"/>
                        </div>
                        <div className="livestream container" id="livestream-container" style={{ display: 'none' }}>
                            <h1 className="livestream-title">Listening to {station.station_name} - {station.station_freq}</h1>
                            <div className="playback">
                                <audio controls autoPlay="autoplay" id="audio" onCanPlay={(e) => ReadyToPlay(e)}>
                                    <source src="http://173.49.251.28:8090/live" type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                            </div>
                            <button onClick={() => stopAudio()}>Disconnect</button>
                        </div>
                    </div>}
            </div>
        </div>
    )
}