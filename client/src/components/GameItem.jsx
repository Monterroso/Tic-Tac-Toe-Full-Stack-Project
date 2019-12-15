import React, { useState } from "react";
// const uuidv1 = require('uuid/v1');

/**
 * 
 * @param {*} props 
 */

function GameItem(props) {
  let classes = "";
  if (props.right) {
    classes = classes.concat("border-right ");
  }
  if (props.left) {
    classes = classes.concat("border-left ");
  } 
  if (props.top) {
    classes = classes.concat("border-top ");
  }
  if (props.bottom) {
    classes = classes.concat("border-bottom ");
  }

  let widthMod = 50;
  let heightMod = 50;
  let fontSizeMod = 20;
  let borderWithMod = .5;

  let style = {
    width: `${widthMod/props.width}rem`,
    height: `${heightMod/props.width}rem`, 
    fontSize: `${fontSizeMod/props.width}rem`,
    borderWidth: `${borderWithMod/props.width}rem`,
    verticalAlign: "middle"
  }

  let itemList = ['', "X", "O"];

  return (<span style={style} className={`grid-item ${classes}`}>{itemList[props.item]}</span>);
}

export default GameItem;