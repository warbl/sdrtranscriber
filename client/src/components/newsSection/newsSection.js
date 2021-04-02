import React, { useState, useEffect } from "react";
import Axios from 'axios';
import "./newsSection.css";
import { formatDate } from '../helpers/formatDate';



export default function NewsSection() {
    const [newsContent, setNewsContent] = useState();
    const [lastUpdated, setLastUpdated] = useState();

    useEffect(() => {
        fetchNewsContent();
        const id = setInterval(fetchNewsContent, 10000);
        return () => clearInterval(id);
    }, []);

    const fetchNewsContent = () => {
        Axios.get("https://sdrtranscriber.tk:3002/api/getNewsContent").then((response) => {
            setNewsContent(response.data);
            const data = response.data;
            const last_time = formatDate(data[data.length - 1].time_of_broadcast);
            setLastUpdated(last_time);
        }).catch((error) => {
            console.log(error);
        })
    };

    return (
        <div className="news">
            <div className="heading">
                <span className="title">Here is the Transcribed News Report from KYW NEWS</span>
                <span className="time-stamp">(last updated: {lastUpdated})</span>
            </div>
            <div className="playback">
                <audio controls>
                    <source src="http://173.49.251.28:8090/live" type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </div>
            <div className="news_container">
                {newsContent && newsContent.map((val) => {
                    return (
                        <span className="news-section" key={val.time_of_broadcast}>
                            {val.transcribed_speech}&nbsp;
                        </span>
                    )
                })}
            </div>
        </div>
    )
}