// /client/src/App.js

import React, { useState, useEffect } from "react";

// SERVICES
import gameService from './services/gameService';

// COMPONENTS
import GameDisplay from "./components/GameDisplay.jsx";

const uuidv1 = require('uuid/v1');

function App() {

  const [games, setGames] = useState(null);

  useEffect(() => {
    if(!games) {
      getGames();
    }
  })

  const getGames = async () => {
    let res = await gameService.getAllGames();
    setGames(res);
  }

  const getPlayers = async () => {
    let res = await gameService.getAllPlayers();
  }

  const renderGame = game => {
    return (
      <GameDisplay id={game._id} winner={game.winner} grid={game.game_json.Object.board.Object.grid}/>
    );
  };
  getPlayers();
  return (
    <div className="App">
      <ul className="list">
        {(games && games.length > 0) ? (
          games.map(game => <li key={uuidv1()}>{renderGame(game)}</li>)
        ) : (
          <p>There are no games in the database currently</p>
        )}
      </ul>
    </div>
  );
}

export default App;