import React, { useState, useEffect, useRef } from "react";
import PCMPlayer from "../helpers/pcmPlayer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner, faBars, faBroadcastTower } from "@fortawesome/free-solid-svg-icons";
import Axios from 'axios';
import './radio.css';

var scanningInterval = null;
var player = null;
var ws = null;
var i = 0;

export default function Radio() {
    const [stationList, setStationList] = useState();
    const [livestream, setLivestream] = useState(false);
    const [station, setStation] = useState();
    const sidebarRef = useRef(null);
    const sidebarNavRef = useRef(null);
    const [hideSidebar, setHideSidebar] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [stationReady, setStationReady] = useState(false);
    const [stopScanning, setStopScanning] = useState(false);


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
        Axios.get("https://sdrtranscriber.tk:3002/api/getStations").then((response) => {
            console.log(response.data);
            setStationList(response.data);
        }).catch((error) => {
            console.log(error);
        });
    };

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

    const clickStation = (val) => {
        if (livestream || scanning) {
            stopAudio();
        }
        setStation(val);
        toggleSidebar();
    }

    const removeStation = () => {
        setStation(null);
    }

    const tuneToStation = () => {
        setLivestream(true);
        const tempStation = station.station_freq.toString();
        const stationFreq = tempStation.replace('.', '') + '00000';
        const req_station = { station: "F " + stationFreq };
        Axios.post("https://sdrtranscriber.tk:3002/api/connectToStation", req_station).then((response) => {
            console.log(response);
            playAudio();
            setStationReady(true);
        }).catch((error) => {
            console.log(error);
        });
    }

    const playAudio = () => {
        var socketURL = 'wss://sdrstream.tk:5000/sound';
        player = new PCMPlayer({
            encoding: '16bitInt',
            channels: 1,
            sampleRate: 48000,
            flushingTime: 75
        });
        ws = new WebSocket(socketURL);
        player.volume = 1;
        ws.onmessage = function (event) {
            var data = new Uint16Array(JSON.parse(event.data));

            player.feed(data);
        }
    }

    const stopAudio = () => {
        setLivestream(false);
		ws.close();
		player.destroy();
        if (scanning) {
            setLivestream(false);
            setScanning(false);
        } else {
            setStation(null);
            setStationReady(false);
        }
    }

    const startScanning = () => {
        setLivestream(true);
        setScanning(true);
        playAudio();
        changeStation(i);
        i = 1;
        scanningInterval = setInterval(() => {
            changeStation(i); 
            if(i === stationList.length -1){
                i = 0;
            } else {
                i = i + 1;
            }
        }, 7000);
    }

    const changeStation = (i) => {
        if (!stopScanning) {
            const tempStation = stationList[i].station_freq.toString();
            const stationFreq = tempStation.replace('.', '') + '00000';
            const req_station = { station: "F " + stationFreq };
            Axios.post("https://sdrtranscriber.tk:3002/api/connectToStation", req_station).then((response) => {
                console.log(response);
                document.getElementById("scanning-header").innerHTML = "Scanning Station " + stationList[i].station_name + "-" + stationList[i].station_freq;
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    const stayOnStation = () => {
        clearInterval(scanningInterval);
        setStopScanning(true);
        document.getElementById("stay-button").style.display = "none";
        document.getElementById("scanning-header").innerHTML = "Playing Station " + stationList[i].station_name + "-" + stationList[i].station_freq;;
        document.getElementById("scanning-radio").classList.remove("fa-pulse");
    }

    return (
        <div className="radio">
            <div className="find-song-container">
                {!(station || scanning) &&
                    <div className="mobile-header">
                        <h1 className="title">Choose a Station</h1>
                        <h1 className="or">Or</h1>
                        <button className="scan-button" id="scan-button" onClick={() => startScanning()}>Scan Stations</button>
                    </div>
                }
                {station && !livestream &&
                    <div className="select-station">
                        <h3>Listen to station: {station.station_name} - {station.station_freq}?</h3>
                        <button onClick={() => removeStation()}>Cancel</button>
                        <button id="connect-button" onClick={() => tuneToStation()}>Connect</button>
                    </div>}
                {station && livestream && !stationReady &&
                    <div className="loading-container" id="loading-container">
                        <p className="loading-text">Connecting to Station...</p>
                        <FontAwesomeIcon icon={faSpinner} id="loading-indicator" className="loading-inidicator fa-pulse fa-4x" />
                    </div>}
                {station && livestream && stationReady &&
                    <div className="livestream-container" id="livestream-container">
                        <h1 className="livestream-title">Now Listening to {station.station_name} - {station.station_freq}</h1>
                        <FontAwesomeIcon icon={faBroadcastTower} id="listening-to-radio" className="listening-to-radio fa-4x" /><br />
                        <button className="disconnect-button" onClick={() => stopAudio()}>Disconnect</button>
                    </div>}
                {scanning && livestream &&
                    <div className="scanning-container" id="scanning-container">
                        <p className="loading-text" id="scanning-header">Scanning Stations...</p>
                        <FontAwesomeIcon icon={faBroadcastTower} id="scanning-radio" className="listening-to-radio fa-pulse fa-4x" /><br />
                        <button className="stay-button" id="stay-button" onClick={() => stayOnStation()}>Stay</button>
                        <button className="disconnect-button" onClick={() => stopAudio()}>Disconnect</button>
                    </div>}
            </div>
            <FontAwesomeIcon onClick={toggleSidebar} id="menuBtn" icon={faBars} />
            <div ref={sidebarRef} className="sidePanel">
                <div ref={sidebarNavRef} className="side-nav-bar">
                    <h3 className="station-list-header">Stations</h3>
                    <div className="list_container" id="station-container">
                        {stationList && stationList.map((val, index) => {
                            return (
                                <div className="station" key={val.station_id} onClick={() => clickStation(val)} data-testid={'station_' + index}>
                                    <img className="station-logo" alt={val.station_name} src={val.music_img} data-testid={'station_img_' + index} />
                                    <span className="station-name" data-testid={'station_info_' + index}>{val.station_name}-{val.station_freq}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}