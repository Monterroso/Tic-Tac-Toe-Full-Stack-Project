import React, { useState, useEffect } from "react";

// SERVICES
import gameService from '../services/gameService';

// COMPONENTS
import GameDisplay from "./GameDisplay.jsx";
import Navbar from "./Navbar.jsx";

import uuid from "uuid";
import { navigate } from "hookrouter";

function Home() {

  const [games, setGames] = useState(null);

  useEffect(() => {
    if(!games) {
      getGames();
    }
  });

  //if user is already logged in then go to login
  useEffect(() => {
    gameService.checkLogin(isLoggedIn => !isLoggedIn && navigate("/login"));
  }, []);

  const getGames = async () => {
    let res = await gameService.getAllGames();
    setGames(res);
  }

  const renderGame = game => {
    return (
      <GameDisplay id={game._id} winner={game.winner} grid={game.game_json.Object.board.Object.grid}/>
    );
  };


  return (
    <div className="App">
      <Navbar></Navbar>
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