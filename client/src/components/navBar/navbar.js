import React from "react";
import "./navbar.css";
import {useHistory} from 'react-router-dom';
import hamburger from '../../images/hamburger.png'



export default function NavBar(){
	const history = useHistory();
	
			
		function displayTabs(){
			var x = document.getElementById("topNav");
			if(x.className === "nav"){
				x.className += " responsive";
			}
			else{
				x.className = "nav";
			}
		}

		const goToHomePage = () => {
			history.push({
				pathname: '/',
			});
		}
	
    return(
        <div className="nav" id = "topNav">
            <div className="navTitle" onClick={goToHomePage}>
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
				<div className="navLink">
					<a href="/topSongs" className="link">See Top Songs</a>
				</div> 
            </div>
			
			<div className = "hamburgerIcon">
				<a href="#0;" className ="hamburgerLink" onClick = {displayTabs}>
					<img className="hamburgerImage" src ={hamburger} alt ="hamburger icon"/>
				</a>
			</div>
        </div>
    )
}
