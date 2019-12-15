import React, { useState } from "react";
import GameRow from "./GameRow.jsx";
const uuidv1 = require('uuid/v1');


/**
 * 
 * @param {Object} props - Contains the grid as a 2d array to be used to display the game board.
 * @param {List} props.grid - The list of lists that are the columns of the game board
 */
function GameBoard(props) {
  let width = props.grid.length;
  let height = props.grid[0].length;

  let grid = props.grid;
  if (width > height) {
    grid = [];
    for (let i = 0; i < height; i++) {
      grid.push([]);
      for (let j = 0; j < width; j++) {
        grid[i].push(props.grid[j][i]);
      }
    }  
    let temp = height;
    height = width;
    width = temp;
  }

  let rows = [];

  for (let i = 0; i < height; i++) {
    let row = grid.map(column => column[i]);
    rows.push(
      <GameRow 
      key={uuidv1()} 
      top={i === 0? true: false} 
      bottom={i === height-1? true: false} 
      row={row}
      />
    );
  }

  return <div className="board">
    {rows}
  </div>
    

}

export default GameBoard;