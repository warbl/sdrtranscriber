import React, { useState, useEffect } from "react";
import { Form } from 'react-bootstrap';
import Axios from 'axios';
import './musicSection.css'
import ContentArea from "./contentArea";

export default function SidePanel() {
    const [stationList, setStationList] = useState([]);
    const [station, setStation] = useState({});
    const [filterResults, setFilterResults] = useState([]);
	const [stationGenres, setStationGenres] = useState([]);
	
	function openSidebar(){
		document.getElementById("sidebar").style.width ="250px";
		document.getElementById("scrollbar").style.marginLeft = "250px";
		console.log("showing sidepanel");
	}
	
	function closeSidebar(){
		document.getElementById("sidebar").style.width = "0";
		document.getElementById("scrollbar").style.marginLeft="0";
		console.log("hiding sidepanel");
		
	}

    useEffect(() => {
        fetchRadioStations();
        fetchStationGenres();
    }, []);

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
            setStationGenres(response.data);
        }).catch((error) => {
            console.log(error);
        });
    };

    const search = (e) => {
        const search = e.target.value.toString();
        const result = stationList.filter(value => value.station_name.toLowerCase().includes(search.toLowerCase()) || value.station_freq.toString().includes(search));
        setFilterResults(result);
    };

    const filterbyGenre = (e) => {
        const genre = e.target.value;
        console.log(genre);
        if (genre.toLowerCase() === "all stations") {
            setFilterResults(stationList);
            return;
        }
        const result = stationList.filter(value => value.music_genre.toLowerCase().includes(genre.toLowerCase()));
        setFilterResults(result);
    };

    const clickStation = (val) => {
        setStation(val);
    };
    return (
        <div className="music">
			<button class="open-btn" onClick = {openSidebar}>&#9776; Stations</button>
            <div className="sidePanel" id ="sidebar">
				<a href ="javascript:void(0)" className = "close-btn" onClick = {closeSidebar}>&times;</a>
                <Form className="filter-form-stations">
                    <Form.Group className="filter-form-station-box">
                        <Form.Control onChange={search} className='filter-form-station-input' type="text" placeholder=" Search stations..." />
                    </Form.Group>
                    {stationGenres && <Form.Group>
                        <select type="text" className="form_dropdown" onChange={filterbyGenre}>
                            <option value={"all stations"}>All Stations</option>
                            {stationGenres && stationGenres.map((val) => {
                                return (
                                    <option key={val.music_genre} value={val.music_genre}>{val.music_genre}</option>
                                )
                            })}
                        </select>
                    </Form.Group>}
                </Form>
                <div className="list_container" id='scrollbar'>
                    {filterResults && filterResults.map((val) => {
                        return (
                            <div className="station" key={val.station_id} onClick={() => clickStation(val)}>
                                <h3>{val.station_name}</h3>
                                <span>({val.station_freq})</span>
                            </div>
                        )
                    })}
                </div>
            </div>
            <ContentArea station={station} />
        </div>
    );
}