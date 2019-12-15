import React from "react";
import GameItem from "./GameItem.jsx";
const uuidv1 = require('uuid/v1');


function GameRow(props) {
  let width = props.row.length;

  let items = [];

  for (let i = 0; i < width; i++) {
    items.push(
    <GameItem 
    width={width}
    top={props.top} 
    bottom={props.bottom} 
    left={i === 0? true: false} 
    right={i === width-1? true: false}
    key={uuidv1()} 
    item={props.row[i]}
    />);
  }

  return (<div className="grid-row">{items}</div>);
}

export default GameRow;