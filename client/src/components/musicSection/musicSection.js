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
    const [input, setInput] = useState('');
    const [genre, setGenre] = useState("All Genres");

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
        }else{
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
        }else{
        const result = stationList.filter(value => value.music_genre.toLowerCase().includes(search.toLowerCase()) && (value.station_name.toLowerCase().includes(input.toLowerCase()) || value.station_freq.toString().includes(input)));
        setFilterResults(result);
        }
    };

    const clickStation = (val) => {
        setStation(val);
    };
    return (
        <div className="music">
            <div className="sidePanel">
                <Form className="filter-form-stations">
                    <Form.Group className="filter-form-station-box">
                        <Form.Control className='filter-form-station-input' type="text" placeholder=" Search stations..." value={input} onChange={(e) => {setInput(e.target.value); search(e)}}/>
                    </Form.Group>
                    {stationGenres && <Form.Group>
                        <select type="text" className="filter-form_dropdown" value={genre} onChange={(e) => {setGenre(e.target.value); filterbyGenre(e)}}>
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
            <ContentArea station={station} />
        </div>
    );
}