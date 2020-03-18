import React, { useState, useEffect } from "react";

// SERVICES
import gameService from '../services/gameService';

// COMPONENTS
import Navbar from "./Navbar.jsx";

//ELEMENTS
import Button from '@material-ui/core/Button';

import uuid from "uuid";
import { navigate } from "hookrouter";

function FriendPage() {

  const [friends, setFriends] = useState(null);

  // useEffect(() => {
  //   getFriends();
  // });

  //if user is already logged in then go to login
  useEffect(() => {
    gameService.checkLogin(isLoggedIn => !isLoggedIn && navigate("/login"));
    getFriends();
  }, []);

  const getFriends = async () => {
    let res = await gameService.getMe(()=>{});
    console.log("This is the friend list " + JSON.stringify(res));
    setFriends(res.friendList);
  };

  const renderFriends = friend => {
    return (
      {friend}
    );
  };

  const createGame = () => {

  }

  return (
    <div className="CreateGame">
      <Navbar></Navbar>
      <form className="GameParamters" onSubmit={createGame}>
        <label>Dimension 1</label>
        <input type="number" name="dim1" min="1"/>
        <label>Dimension 2</label>
        <input type="number" name="dim2" min="1"/>
        <label>Win amount</label>
        <input type="number" name="winamount"/>
        <label>Diagnals allowed?</label>
        <input type="checkbox" name="diagnals"/>
        <input type="submit" value="Create Game!"/>
        <label>Select Opponent</label>
        <select name="otherUser">
          {/* {friends.map(friend => <option value={friend}>{friend}</option>)} */}
        </select>
      </form>
    </div>
    
  );
}

export default FriendPage;