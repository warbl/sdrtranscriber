import React, {useState, useEffect} from "react";
import {Form} from 'react-bootstrap';
import Axios from 'axios';
import './musicSection.css'
import ContentArea from "./contentArea";

export default function SidePanel(){
    const [stationList, setStationList] = useState([]);
    const [station, setStation] = useState({});
    const [filterResults, setFilterResults] = useState([]);

    useEffect(() => {
        fetchRadioStations();
    },[]);

    //figure out loop to sleep then fetch data again

    const fetchRadioStations = async () => {
        Axios.get("http://localhost:3001/api/getStations").then((response) => {
            console.log(response.data);
            setStationList(response.data);
            setStation(response.data[0]);
            setFilterResults(response.data);
        }).catch((error) => {
            console.log(error);
        });
    };

    const search = (e) => {
        const search = e.target.value.toString();
        console.log(search);
        const result = stationList.filter(value =>  value.station_name.toLowerCase().includes(search.toLowerCase()) || value.station_freq.toString().includes(search));
        setFilterResults(result);
    };

    const clickStation = (val) => {
        setStation(val);
    };

    return (
        <div className="music">
            <div className="sidePanel">
            <Form className="filter-form-stations">
                <Form.Group className="filter-form-station-box">
                    <Form.Control onChange={search} className='filter-form-station-input' type="text" placeholder=" Search stations..." />
                </Form.Group>
            </Form>
                <div className="list_container" id='scrollbar'>
                    {filterResults && filterResults.map((val) => {
                        return(
                        <div className="station" key={val.station_id} onClick={() => clickStation(val)}>
                            <h3 key={val.station_id} id={val.station_id}>{val.station_name}</h3>
                            <span key={val.station_id} id={val.station_id}>({val.station_freq})</span>
                        </div>
                    )
                })} 
                </div>
                </div>
            <ContentArea station={station}/>
        </div>
    );
}