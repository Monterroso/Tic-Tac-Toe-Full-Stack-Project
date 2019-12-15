import React from "react";
import GameBoard from "./GameBoard.jsx";
const uuidv1 = require('uuid/v1');


function GameDisplay(props) {
  let itemList = ['', "X", "O"];
  
  return (<div className="grid-display">
    <h3>Game with id {props.id}</h3>
    <p>{props.winner === 0? "The game is still ongoing": props.winner === -1? "The game is a tie": `The winner is ${itemList[props.winner]} `}</p>
    <GameBoard key={uuidv1()} grid={props.grid}/>
  </div>);
}

export default GameDisplay;