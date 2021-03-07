import React from "react";
import "./homeStyle.css";
import radio from '../../images/radio.png'


export default function Home(){
    return(
        <div className="home">
           <h1 className="heading">No radio No problem</h1>
           <h3 className="paragraph">Enjoy and explore all the content from the radio stations of Philadelphia right here!</h3>
           <img className="icon" src={radio}  alt="home page icon"/>
        </div>
    )
}

