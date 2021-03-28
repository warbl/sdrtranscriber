import React, { useState, useEffect, useRef } from "react";
import { Form } from 'react-bootstrap';
import Axios from 'axios';
import './musicSection.css'
import ContentArea from "./contentArea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function SidePanel() {
    const [stationList, setStationList] = useState([]);
    const [station, setStation] = useState({});
    const [filterResults, setFilterResults] = useState([]);
    const [stationGenres, setStationGenres] = useState([]);
    const [input, setInput] = useState('');
    const [genre, setGenre] = useState("All Genres");
    const sidebarRef = useRef(null);
    const sidebarNavRef = useRef(null);
    const [hideSidebar, setHideSidebar] = useState(false);

    useEffect(() => {
        fetchRadioStations();
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

    const fetchRadioStations = async () => {
        Axios.get("http://localhost:3001/api/getStations").then((response) => {
            console.log(response.data);
            setStationList(response.data);
            setFilterResults(response.data);
            setStation(response.data[0]);
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
        toggleSidebar();
    };

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

    return (
        <div className="music">
            <FontAwesomeIcon onClick={toggleSidebar} id="menuBtn" icon={faBars} />
            <div ref={sidebarRef} className="sidePanel">
                <div ref={sidebarNavRef} className="side-nav-bar">
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
            <ContentArea station={station} toggleSidebar={toggleSidebar} />
        </div>
    );
}