import React, { useState, useEffect } from "react";
import "./navbar.css";
import { useHistory } from 'react-router-dom';
import logo from '../../images/capstone logo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons";



export default function NavBar() {
	const history = useHistory();
	const [hideNavLinks, setHideNavLinks] = useState(true);

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		return function cleanupListener() {
			window.removeEventListener('resize', handleResize)
		}
	}, []);

	const handleResize = () => {
		let navLinks = document.getElementById("navLinks");
		if (window.innerWidth > 780) {
			setHideNavLinks(true);
			navLinks.style.display = "block";
		} else {
			navLinks.style.display = "none";
		}
	};

	const goToHomePage = () => {
		history.push({
			pathname: '/',
		});
	}

	const toggleNavLinks = () => {
		let navLinks = document.getElementById('navLinks');
		if (!hideNavLinks) {
			navLinks.style.display = "none";
			setHideNavLinks(true);
		} else {
			navLinks.style.display = "block";
			setHideNavLinks(false);
		}
	};

	return (
		<div className="nav" id="topNav">
			<div onClick={goToHomePage}>
				<img className="logo" src={logo} alt="sdr logo" onClick={goToHomePage} />
			</div>
			<div className="navTabs" id="navLinks">
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
					<a href="/topSongs" className="link">Top Songs</a>
				</div>
			</div>
			<FontAwesomeIcon id="navMenuBtn" icon={faBars} onClick={toggleNavLinks} />
		</div>
	)
}

