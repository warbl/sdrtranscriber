import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner, faBars } from "@fortawesome/free-solid-svg-icons";
import Axios from 'axios';
import './radio.css'


export default function Radio() {
    const [stationList, setStationList] = useState();
    const [livestream, setLivestream] = useState(false);
    const [station, setStation] = useState();
    const sidebarRef = useRef(null);
    const sidebarNavRef = useRef(null);
    const [hideSidebar, setHideSidebar] = useState(false);

    useEffect(() => {
        fetchStations();
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
        let mobileBtn = document.getElementById('menuBtn');
        if (window.innerWidth > 750) {
            setHideSidebar(false);
            mobileBtn.style.display = "none";
            sidebarRef.current.style.display = "block";

        } else {
            mobileBtn.style.display = "block";
            mobileBtn.style.color = "#485060";
        }
    };

    const fetchStations = async () => {
        Axios.get("http://localhost:3001/api/getStations").then((response) => {
            console.log(response.data);
            setStationList(response.data);
        }).catch((error) => {
            console.log(error);
        });
    };

    const clickStation = (val) => {
        if (livestream) {
            stopAudio();
        }
        setStation(val);
        toggleSidebar();
    }

    const toggleSidebar = () => {
        let mobileBtn = document.getElementById('menuBtn');
        if (window.innerWidth > 750) return;
        if (!hideSidebar) {
            mobileBtn.style.color = "#C7AC7A";
            sidebarRef.current.style.display = "none";
            setHideSidebar(true);
        } else {
            mobileBtn.style.color = "#485060";
            sidebarRef.current.style.display = "block";
            setHideSidebar(false);
        }
    };


    const tuneToStation = () => {
        //send station name to api
        //poll other api until you receive a livestream link back
        // setLivestreamLink(response.data);
        setLivestream(true);
        setTimeout(() => { readyToPlay() }, 3000);
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

    const readyToPlay = (e) => {
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
                            <FontAwesomeIcon icon={faSpinner} id="loading-indicator" className="loading-inidicator fa-pulse fa-4x" />
                        </div>
                        <div className="livestream container" id="livestream-container" style={{ display: 'none' }}>
                            <h1 className="livestream-title">Listening to {station.station_name} - {station.station_freq}</h1>
                            <div className="playback">
                                <audio controls autoPlay="autoplay" id="audio">
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
                    <h3 className="station-list-header">Stations</h3>
                    <div className="list_container" id="station-container">
                        {stationList && stationList.map((val) => {
                            return (
                                <div className="station" key={val.station_id} onClick={() => clickStation(val)}>
                                    <img className="station-logo" alt={val.station_name} src={val.music_img} />
                                    <span className="station-name">{val.station_name}-{val.station_freq}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}