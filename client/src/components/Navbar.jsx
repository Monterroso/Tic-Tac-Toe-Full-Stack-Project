import React, { useState, useEffect } from "react";

import gameService from "../services/gameService.js";

import { navigate } from "hookrouter";

// gameService.logoutPlayer( () => gameService.checkLogin(isLoggedIn => !isLoggedIn && navigate("/login")));

function logOut() {
  gameService.logoutPlayer( () => navigate("/login"));
}

function toHome() {
  navigate("/home");
}

function toFriends() {
  navigate("/friends");
}

function toCreateGame() {
  navigate("/createGame");
}

function Navbar() {
    return (
      <ul className="navbar">
        <li className="active" onClick={toHome}>
          Home
        </li>
        <li onClick={toFriends}>
          Friend
        </li>
        <li onClick={toCreateGame}>
          Create Game
        </li>
        <li className="last" onClick={logOut}>
          Logout
        </li>
      </ul>
    );
}

export default Navbar;
