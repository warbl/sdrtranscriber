import React, { useState, useEffect } from "react";
import Axios from 'axios';
import "./newsSection.css";



export default function NewsSection(){
    const [newsContent, setNewsContent] = useState();

    useEffect(() => {
        fetchNewsContent();
        const id = setInterval(fetchNewsContent, 10000);
        return () => clearInterval(id);
    }, []);

    const fetchNewsContent= () => {
        Axios.get("http://localhost:3001/api/getNewsContent").then((response) => {
            setNewsContent(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    };

    return(
        <div className="news">
           <h1 className="title">Here is the Transcribed News Report from KYW NEWS</h1>
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