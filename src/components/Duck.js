import imageSrc from "../img/PurpleDuck-Sheet.png";
import React from "react";

function Duck(props) {
    return (
        <div
            className={
                `duck 
                ${props.isHit ? 'duck--hurt' : ''} 
                ${props.isJump ? 'duck--jump' : ''}`
            }
            onClick={() => props.onClick()}>
            <div className="duck__sprite-sheet-wrap">
                <img src={imageSrc} className="duck__sprite-sheet" alt={props.name}/>
            </div>
        </div>
    )
}

export default Duck;