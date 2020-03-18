import React, { useState, useEffect } from "react";

// ROUTING
import { useRoutes, A } from "hookrouter";

// SERVICES
import gameService from './services/gameService';

// COMPONENTS
import GameDisplay from "./components/GameDisplay.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Home from "./components/Home.jsx";
import NotFound from "./components/NotFound.jsx";
import Friends from "./components/Friends.jsx";
import CreateGame from "./components/CreateGame.jsx";

import uuid from "uuid";

function App() {
  // const [loggedIn, setLoggedIn] = useState(null);
  // const [registerPage, setRegisterPage] = useState(null);

  const routes = {
    "/login": () => <Login />,
    "/register": () => <Register />,
    "/home": () => <Home />,
    "/friends": () => <Friends />,
    "/createGame": () => <CreateGame />,
    "/": () => <Home />
  };

  const routeResult = useRoutes(routes);

  return routeResult || <NotFound />;
}

export default App;