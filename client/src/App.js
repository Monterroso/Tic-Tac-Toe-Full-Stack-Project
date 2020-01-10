// /client/src/App.js

import React, { useState, useEffect } from "react";

// SERVICES
import gameService from './services/gameService';

// COMPONENTS
import GameDisplay from "./components/GameDisplay.jsx";

const uuidv1 = require('uuid/v1');

function App() {

  console.log(window.innerWidth);
  const [games, setGames] = useState(null);

  useEffect(() => {
    if(!games) {
      getGames();
    }
  })

  const getGames = async () => {
    let res = await gameService.getAll();
    setGames(res);
  }

  const renderGame = game => {
    return (
      <GameDisplay id={game._id} winner={game.winner} grid={game.game_json.Object.board.Object.grid}/>
    );
  };

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