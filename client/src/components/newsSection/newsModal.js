import React, { useState, useEffect } from "react";
import "./newsSection.css";
import { formatDate } from '../helpers/formatDate';


export default function NewsModal({ handleClick, newsContent }) {
    const [newsGroups, setNewsGroups] = useState();
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        getNewsSections();
    }, [newsContent]);


    const getNewsSections = () => {
        if (newsContent && newsContent.length >= 0) {
            var groups = [];
            for (var index = 0; index < newsContent.length; index += 5) {
                groups.push(newsContent.slice(index, index + 5));
            }
            console.log(groups);
            setNewsGroups(groups);
        }

    }

    const toggleContent = (index) => {
        const section = document.getElementById('popup-news-container-'+ index)
        console.log(section);
        if(section.style.display === "block"){
            section.style.display = "none";
        } else {
            section.style.display = "block";
        }
    }


    return (
        <div className="popup">
            <h1 className="heading">Past News</h1>
            <div className="content">
                <button className="close" onClick={handleClick}>Close</button>
                {newsGroups && newsGroups.map((element, index) => {
                    return (
                    <div className="popup-news-container">
                        <h3 className="popup-time-header" onClick={() => toggleContent(index)}>{formatDate(element[0].time_of_broadcast)}</h3>
                        <div id={"popup-news-container-"+index} style={{display: "none"}}>
                        {element.map((val) => {
                            return (
                                <span className="popup-news-container-content" key={val.time_of_broadcast}>
                                    {val.transcribed_speech}&nbsp;
                                </span>
                            )
                        })}
                        </div>
                    </div>)
                })}

            </div>
        </div>
    )
}