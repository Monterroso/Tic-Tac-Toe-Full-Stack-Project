import React, { useState, useEffect } from "react";

// SERVICES
import gameService from '../services/gameService';
import { navigate } from "hookrouter";

function Register() {
    const [namePassword, setNamePassword] = useState({username: "", password: ""});
    const [userConflict, setUserConflict] = useState(null);

    function handleNamePasswordChange(name, target) {
      setNamePassword((prevVal => ({
        ...prevVal,
        [name]:  target
      }))
      );
    }

    function checkLogIn(isLoggedIn) {
      if(isLoggedIn) {
        navigate("/home");
      }
    }

    function checkRegister(response) {
      if (response == "Success") {
        navigate("/home");
      }
      else if(response === "UserExistsError"){
        setUserConflict(namePassword.username);
      } else {
        console.log(response)
      }
    }

    function handleSubmit(event) {
      event.preventDefault();    
      gameService.registerPlayer(namePassword.username, namePassword.password, checkRegister);
    }

    function toLogin() {
      navigate("/login");
    }

    //if user is already logged in then go to home
    useEffect(() => {
      gameService.checkLogin(checkLogIn);
    }, []);
   
    return (<div className="input-box">
      <h3>Register</h3>
        <form onSubmit={handleSubmit}>
        <h4 className="incorrect" style={{display: userConflict? "block": "none"}}>{userConflict} is already taken</h4>
          <input type="text" name="username" className={"input-field"} onChange={event => handleNamePasswordChange(event.target.name, event.target.value)} placeholder="Username"/>
          <input type="password" name="password" className={"input-field"} onChange={event => handleNamePasswordChange(event.target.name, event.target.value)} placeholder="Password"/>
          <input type="submit" value="Submit"/>
          <p className="clickable" onClick={toLogin}>Already have an account? Sign in here!</p>
        </form>
    </div>
   
   );
}
  
export default Register;