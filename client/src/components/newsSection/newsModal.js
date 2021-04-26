import React, { useState, useEffect } from "react";
import "./newsSection.css";
import { formatDate } from '../helpers/formatDate';


export default function NewsModal({ handleClick, newsContent }) {
    const [newsGroups, setNewsGroups] = useState();

    useEffect(() => {
        getNewsSections();
    }, [newsContent]);


    const getNewsSections = () => {
        if (newsContent && newsContent.length >= 0) {
            var groups = [];
            for (var index = 0; index < newsContent.length; index += 10) {
                groups.push(newsContent.slice(index, index + 10));
            }
            setNewsGroups(groups);
        }

    }

    const toggleContent = (index) => {
        const section = document.getElementById('popup-news-content-' + index);
        const button = document.getElementById('popup-news-button-' + index);
        if(section.style.display === "block"){
            section.style.display = "none";
            button.innerText = "Read News";
        } else {
            section.style.display = "block";
            button.innerText = "Close";
        }
    }

    return (
        <div className="popup">
            <h1 className="heading">All News</h1>
            <div className="content">
                <button className="close" onClick={handleClick}>Close</button>
                {newsGroups && newsGroups.map((element, index) => {
                    return (
                    <div className="popup-news-container" key={"popup-news-content-"+index}>
                        <div className="popup-header">
                        <h3 className="popup-time">{formatDate(element[0].time_of_broadcast)}</h3>
                        <button className="popup-button" onClick={() => toggleContent(index)} id={"popup-news-button-"+index}>Read News</button>
                        </div>
                        <div className="popup-news-content" id={"popup-news-content-"+index} style={{display: "none"}} data-testid={"popup-news-content-"+index}>
                        {element.map((val) => {
                            return (
                                <span key={val.time_of_broadcast}>
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