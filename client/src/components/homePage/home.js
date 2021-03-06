import React from "react";
import "./homeStyle.css";
import radioTower from '../../images/radio-tower.png'


export default function Home(){
    return(
        <div className="home">
           <h1 className="heading">No radio No problem</h1>
           <h3 className="paragraph">Enjoy and explore all the content of philadelphia radio stations right here!</h3>
           <img className="icon" src={radioTower}  alt="home page icon"/>
        </div>
    )
}

