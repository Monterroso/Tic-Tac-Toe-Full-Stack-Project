import React, { useState, useEffect } from "react";

// SERVICES
import gameService from '../services/gameService';
import { navigate } from "hookrouter";


function Login(props) {
    const [namePassword, setNamePassword] = useState({username: "", password: "", rememberMe: false});

    const [triedLogging, settriedLogging] = useState(false);

    function handleNamePasswordChange(name, target) {
      setNamePassword((prevVal => ({
        ...prevVal,
        [name]:  target
      }))
      );
    }

    function checkLogIn(response) {
      if (response === "Success") {
        navigate("/home");
      }
      else if (response === "IncorrectUsernameError") {
        settriedLogging(true);
      }
    }

    function handleSubmit(event) {
      event.preventDefault();  
      gameService.loginPlayer(namePassword.username, namePassword.password, namePassword.rememberMe, checkLogIn);
    }

    function toRegister() {
      navigate("/register");
    }

    //if user is already logged in then go to home
    useEffect(() => {
      gameService.checkLogin(checkLogIn);
    }, []);
  

    return (<div>
      <div className="input-box">
        <h3 >Login</h3>
        <form onSubmit={handleSubmit}>
          <h4 className="incorrect" style={{display: triedLogging? "block": "none"}}>Wrong Username or Password</h4>
          <input type="text" name="username" className={"input-field"} onChange={event => handleNamePasswordChange(event.target.name, event.target.value)} placeholder="Username"/>
          <input type="password" name="password" className={"input-field"} onChange={event => handleNamePasswordChange(event.target.name, event.target.value)} placeholder="Password"/>
          <input type="checkbox" name="rememberMe" onChange={event => handleNamePasswordChange(event.target.name,event.target.checked)}/>
          <p>Remember Me</p> 
          <input className="plain-button" style={{marginLeft: "50%", transform: "translate(-50%, 0)"}} type="submit" value="Login"/>
          <p className="clickable" onClick={toRegister}>Don't have an account? Create one now!</p>
          
        </form>
      </div>
      
    </div>
   
   );
  
  }

export default Login;
  