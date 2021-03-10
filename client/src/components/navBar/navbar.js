import React from "react";
import "./navbar.css";
import {Link} from 'react-router-dom';
import hamburger from '../../images/hamburger.png'



export default function NavBar(){
	
			
		function displayTabs(){
			var x = document.getElementById("topNav");
			if(x.className === "nav"){
				x.className += " responsive";
			}
			else{
				x.className = "topnav";
			}
		}
	
    return(
        <div className="nav" id = "topNav">
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
			
            </div>
			
			<div className = "hamburgerIcon">
				<a href="#0;" className ="hamburgerLink" onClick = {displayTabs}>
					<img classname="hamburgerImage" src ={hamburger} alt ="hamburger icon"/>
				</a>
			</div>
        </div>
    )
}
