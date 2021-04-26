import React, { useState, useEffect } from "react";
import Axios from 'axios';
import "./newsSection.css";
import { formatDate } from '../helpers/formatDate';
import NewsModal from './newsModal';



export default function NewsSection() {
    const [newsContent, setNewsContent] = useState();
    const [recentNewsContent, setRecentNewsContent] = useState();
    const [lastUpdated, setLastUpdated] = useState();
    const [showNewsModal, setShowNewsModal] = useState(false);

    useEffect(() => {
        fetchNewsContent();
        const id = setInterval(fetchNewsContent, 100000);
        return () => clearInterval(id);
    }, []);

    const fetchNewsContent = () => {
        Axios.get("https://sdrtranscriber.tk:3002/api/getNewsContent").then((response) => {
            setNewsContent(response.data);
            const data = response.data;
            setRecentNewsContent(response.data.slice(data.length  - 6, data.length - 1));
            const last_time = formatDate(data[data.length - 1].time_of_broadcast);
            setLastUpdated(last_time);
        }).catch((error) => {
            console.log(error);
        })
    };

    const handleClick = () => {
        setShowNewsModal(!showNewsModal);
    }

    return (
        <div className="news">
            <div style={{display: showNewsModal ? 'block' : 'none'}}>
             <NewsModal handleClick={handleClick} newsContent={newsContent} />
             </div>
            <div className="heading">
                <span className="title" data-testid="news-title">Here is the Transcribed News Report from KYW NEWS</span>
                <span className="time-stamp" data-testid="news-timestamp">(last updated: {lastUpdated})</span>
            </div>
            <button className="past-news-button" onClick={handleClick} style={{display: showNewsModal ? 'none' : 'block'}}>All News</button>
            <div className="playback">
                <audio controls>
                    <source src="https://sdrstream.tk:8091/remote2" type="audio/mpeg" data-testid="news-livestream"/>
                    Your browser does not support the audio element.
                </audio>
            </div>
            <div className="news_container" data-testid="news-content">
                {recentNewsContent && recentNewsContent.map((val) => {
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