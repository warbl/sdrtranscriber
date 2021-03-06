import React from "react";
import "./navbar.css";
import {Link} from 'react-router-dom';



export default function NavBar(){
    return(
        <div className="nav">
            <div className="navTitle">
                SDR Transcriber
            </div>
            <div className="navTabs">
            <div className="navLink">
                <Link to="/music" className="link">Search Music</Link>
            </div>  
            <div className="navLink">
                <Link to="/news" className="link">View News</Link>
            </div> 
            <div className="navLink">
                <Link to="/radio" className="link">Listen to Radio</Link>
            </div> 
            </div>
        </div>
    )
}
