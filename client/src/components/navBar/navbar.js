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
                <a href="/music" className="link">Search Music</a>
            </div>  
            <div className="navLink">
                <a href="/news" className="link">View News</a>
            </div> 
            <div className="navLink">
                <a href="/radio" className="link">Listen to Radio</a>
            </div> 
			
			<div className = "hamburgerIcon">
				<a href="javascript:void(0);" className ="icon" onclick ="displayBurger()">
					<i className = "hamburger-icon"></i>
				</a>
			</div>
            </div>
        </div>
    )
}
