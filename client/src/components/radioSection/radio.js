import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner, faBars} from "@fortawesome/free-solid-svg-icons";
import { Form } from 'react-bootstrap';
import Axios from 'axios';
import './radio.css'
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';


export default function Radio() {
    const [stationList, setStationList] = useState();
    const [stationGenres, setStationGenres] = useState();
    const [livestream, setLivestream] = useState(false);
    const [genre, setGenre] = useState();
    const [filterResults, setFilterResults] = useState();
    const [station, setStation] = useState();
    const [input, setInput] = useState('');
    const sidebarRef = useRef(null);
    const sidebarNavRef = useRef(null);
    const [hideSidebar, setHideSidebar] = useState(false);

    useEffect(() => {
        fetchStations();
        fetchStationGenres();
        if (window.innerWidth <= 750) {
            let mobileBtn = document.getElementById('menuBtn');
            mobileBtn.style.display = "block";
        }
        window.addEventListener('resize', handleResize);
        return function cleanupListener() {
            window.removeEventListener('resize', handleResize)
        }
    }, []);

    const handleResize = () => {
        if (window.innerWidth > 750) {
            setHideSidebar(false);
            let mobileBtn = document.getElementById('menuBtn');
            mobileBtn.style.display = "none";
            sidebarRef.current.style.display = "block";

        } else {
            let mobileBtn = document.getElementById('menuBtn');
            mobileBtn.style.display = "block";
            mobileBtn.style.color = "#C7AC7A";
        }
    };

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
        if (livestream) {
            alertify.alert('Error', 'You cannot change stations until you disconnect from current station!');
        } else {
            setStation(val);
            toggleSidebar();
        }
    }

    const toggleSidebar = () => {
        let mobileBtn = document.getElementById('menuBtn');
        if (window.innerWidth > 750) return;
        if (!hideSidebar) {
            mobileBtn.style.color = "#485060";
            sidebarRef.current.style.display = "none";
            setHideSidebar(true);
        } else {
            mobileBtn.style.color = "#C7AC7A";
            sidebarRef.current.style.display = "block";
            setHideSidebar(false);
        }
    };


    const tuneToStation = () => {
        //send station name to api
        //poll other api until you receive a livestream link back
        // setLivestreamLink(response.data);
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
        document.getElementById("livestream-container").style.display = "none";
        document.getElementById("loading-container").style.display = "block";
    }

    const ReadyToPlay = (e) => {
        document.getElementById("livestream-container").style.display = "block";
        document.getElementById("loading-container").style.display = "none";

    }

    return (
        <div className="radio">
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
                        <div className="loading-container" id="loading-container">
                            <p className="loading-text">Connecting to Station...</p>
                                <FontAwesomeIcon icon={faSpinner} className="loading-inidicator fa-pulse fa-4x" />
                        </div>
                        <div className="livestream container" id="livestream-container" style={{ display: 'none' }}>
                            <h1 className="livestream-title">Listening to {station.station_name} - {station.station_freq}</h1>
                            <div className="playback">
                                <audio controls autoPlay="autoplay" id="audio" onCanPlay={(e) => ReadyToPlay(e)}>
                                    <source src="http://173.49.251.28:8090/live" type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                            </div>
                            <button className="disconnect-button" onClick={() => stopAudio()}>Disconnect</button>
                        </div>
                    </div>}
            </div>
            <FontAwesomeIcon onClick={toggleSidebar} id="menuBtn" icon={faBars} />
            <div ref={sidebarRef} className="sidePanel">
                <div ref={sidebarNavRef} className="side-nav-bar">
                    <div className="list_container" id="station-container">
                        {stationList && stationList.map((val) => {
                            return (
                                <div className="station" key={val.station_id} onClick={() => clickStation(val)}>
                                    <img src={val.music_img}/>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}