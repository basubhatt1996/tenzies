import React from "react"

export default function Die(props) {
    function changeFunction(){
        props.holdDice();
       
    }
    return (
        <div className={props.isHeld?"die-face-held":"die-face"} onClick={changeFunction}>
            <h2 className="die-num" key={props.id}>{props.value} </h2>
        </div>
    )
}