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

  const [me, setMe] = useState(null);

  const [friendAddInput, setFriendAddInput] = useState(null);
  const [friendRemoveInput, setFriendRemoveInput] = useState(null);

  const [isMyselfAdd, setIsMyselfAdd] = useState(false);
  const [userNotFoundAdd, setUserNotFoundAded] = useState(false);

  const [allUsers, setAllUsers] = useState([]);

  // useEffect(() => {
  //   getFriends();
  // });

  //if user is already logged in then go to login
  useEffect(() => {
    gameService.checkLogin(isLoggedIn => !isLoggedIn && navigate("/login"));
    getFriends();
    getUsers();
  }, []);

  const getFriends = async () => {
    let res = await gameService.getMe(()=>{});
    console.log("This is the friend list " + res.friendList);
    setFriends(res.friendList);
  };

  const renderFriends = friend => {
    return (
      {friend}
    );
  };

  const getUsers = async () => {
    let res = await gameService.getAllPlayers(()=>{});
    console.log("This is the user list " + JSON.stringify(res));
    setAllUsers(res);
  }

  function handleSubmitAdd(event) {
    event.preventDefault();
    gameService.getMe(data => {
      if (data) {
        if (data.username === friendAddInput) {
          console.log("You cannot add yourself");
          setIsMyselfAdd(true);
        } 
        else {
          console.log("The player has been found and will be added to the friend list");
          gameService.addFriends(data.username, friendAddInput, () => getFriends());
        }
        
      }
      else {
        console.log("The player was not found and there player cannot be added");
        setUserNotFoundAded(true);
      }
    });
  }

  function handleSubmitRemove(event) {
    event.preventDefault();
    gameService.getMe(data => {
      if (data) {
        console.log("The player has been found");
        gameService.removeFriends(data.username, friendRemoveInput, () => getFriends());
      }
      else {
        console.log("The player was not found");
      }
    });
  }

  function handleFriendAddInput(friend) {
    setFriendAddInput(friend);
  }

  function handleFriendRemoveInput(friend) {
    setFriendRemoveInput(friend);
  }

  return (
    <div className="Friends">
      <Navbar></Navbar>
      <div className="friend-box">
        <h3>Add friends</h3>
        <form onSubmit={handleSubmitAdd}>
          <p className="incorrect" style={{display: userNotFoundAdd? "block": "none"}}>That user could not be found</p>
          <p className="incorrect" style={{display: isMyselfAdd? "block": "none"}}>You cannot friend yourself</p>
          <input type="text" 
            name="friendToAdd" 
            className={"temp"} 
            onChange={event => handleFriendAddInput(event.target.value)} 
            placeholder="Type the friend you want to add"
          />
          <br></br>
          <input className="plain-button" type="submit" value="Add Friend"></input>
        </form>
      </div>
      <div className="friend-box">
        <h3>Remove friends</h3>
        <form onSubmit={handleSubmitRemove}>
          <input type="text" 
            name="friendToAdd" 
            className={"temp"} 
            onChange={event => handleFriendRemoveInput(event.target.value)} 
            placeholder="Type the friend you want to remove"
          />          
          <br></br>
          <input className="plain-button" type="submit" value="Remove Friend"></input>
        </form>
      </div>
      <div className="friend-box">
        <h3>Friend List</h3>
        <ul className="list">
          {(friends && friends.length > 0) ? (
            friends.map(friend => <li key={uuid.v1()}>{friend}</li>)
          ) : (
            <p>You currently don't have any friends! Perhaps try to add a few...</p>
          )}
        </ul>
      </div>
      <div className="friend-box">
        <h3>All Users</h3>
        <ul className="list">
        {(allUsers && allUsers.length > 0) ? (
            allUsers.map(user => 
              <li key={uuid.v1()}>{user.username}</li>
            )
          ) : (
            <p>You're currently the only user on this site! That's really sad, 
              grab a friend and get them to make an account. 
            </p>
          )}
        </ul>
      </div>
    </div>
    
  );
}

export default FriendPage;