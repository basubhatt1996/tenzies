import React from "react";
import Die from "./Die";
import {nanoid} from "nanoid"
import Confetti from 'react-confetti'

export default function App(props){
    const [min,setMin]=React.useState(0);
    const [sec,setSec]=React.useState(0);
    const [rollCount,setRollCount]=React.useState(0)
    const [seconds,setSeconds]=React.useState(0);
    const [minute,setMinute]=React.useState(0);
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies,setTenzies]=React.useState(false);
    const [isActive, setIsActive] = React.useState(false);
  //timer function
  React.useEffect(() => {
    let timer = null;
    if(isActive){
      timer = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
      if(seconds===59){
        setSeconds(0)
        setMinute(minute+1);
      }
    }
    else{
        setMinute(0);
        setSeconds(0);
    }
    return () => {
      clearInterval(timer);
    };
  },[isActive]);
//function to check the winning
    React.useEffect(()=>{
        const allHeld=dice.every(die=>die.isHeld)
        const firstElem=dice[0].value;
        const allElem=dice.every(die=>die.value===firstElem)
        
        if(allElem && allHeld){
            setTenzies(true);
            setMin(minute);
            setSec(seconds);
            setMinute(0);
            setSeconds(0);
            setIsActive(false);
        }   
    },[dice])

  
//function to generate a new die
    function generateNewDie(){
        return{
                value:Math.ceil(Math.random() * 6),
                isHeld:false,
                id:nanoid()
            }    
    }
  //function to generate a complete set of 10 dices  
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(
                    generateNewDie()
                )
        }
        return newDice
    }
//function to hold the value of a die when selected
    function holdDice(id){
        setDice(oldDice=>oldDice.map(die=>{
            return (id===die.id?{
                ...die,
                isHeld:!die.isHeld
            }:die)
        }))
    }
//function to change the die state when clicked
    function chnageState(){
        if(tenzies===true){ //run when the game's over
            setTenzies(false);
            setDice(allNewDice());
            setRollCount(0);
        }
        else{
            setDice(oldState=>oldState.map(die=>{
                return die.isHeld ?   die :generateNewDie()       
                       }));
            setRollCount(oldState=>oldState+1)           
        } 
        
     }
    
    const diceElements = dice.map(die => 
        <Die   key={die.id} value={die.value} isHeld={die.isHeld} holdDice={()=>holdDice(die.id)}/>
    )

 return (<main>
             {tenzies?<Confetti />:""}
             <h2 className="title">TENZIES</h2>
             <h3>{minute<10?"0"+minute:minute}:{seconds<10?"0"+seconds:seconds}</h3>
             {!tenzies?<p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>:<h3 className="rollCount">It took {rollCount} rolls and {min<10?"0"+min:min}:{sec<10?"0"+sec:sec} minutes</h3>}
             <div className="dice-container" onClick={()=>{
        if(isActive===false){
            setIsActive(true)
        }
      }} >
                 {diceElements}
             </div>
             <button className="roll-dice" onClick={chnageState}>{tenzies?"New Game":"Roll"}</button>
 </main> )
}