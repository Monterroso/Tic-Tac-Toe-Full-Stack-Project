import React, { useState, useEffect } from "react";

// SERVICES
import gameService from '../services/gameService';

// COMPONENTS
import GameDisplay from "./GameDisplay.jsx";

import uuid from "uuid";
import { navigate } from "hookrouter";

function Home() {

  const [games, setGames] = useState(null);

  useEffect(() => {
    if(!games) {
      getGames();
    }
  });

  // //if user is already logged in then go to login
  // useEffect(() => {
  //   gameService.checkLogin(isLoggedIn => !isLoggedIn && navigate("/login"));
  // }, []);

  const getGames = async () => {
    let res = await gameService.getAllGames();
    setGames(res);
  }

  const renderGame = game => {
    return (
      <GameDisplay id={game._id} winner={game.winner} grid={game.game_json.Object.board.Object.grid}/>
    );
  };

  function redir() {
    console.log("We are redirecting to the login page, because the player should be logged out");
    //We check if the player has indeed been logged out 
    gameService.checkLogin(isLoggedIn => !isLoggedIn && navigate("/login"));
  }

  function logOut() {
    console.log("logOut function called in Home.jsx");
    gameService.logoutPlayer(redir);
    
  }

  return (
    <div className="App">
      <ul className="navbar">
        <li className="active">
          Home
        </li>
        <li className="last" onClick={logOut}>
          Logout
        </li>
      </ul>
      <ul className="list">
        {(games && games.length > 0) ? (
          games.map(game => <li key={uuid.v1()}>{renderGame(game)}</li>)
        ) : (
          <p>There are no games in the database currently</p>
        )}
      </ul>
    </div> 
  );
}

export default Home;