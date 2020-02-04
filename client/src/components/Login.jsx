import React, { useState, useEffect } from "react";

// SERVICES
import gameService from '../services/gameService';
import { navigate } from "hookrouter";


function Login(props) {
    const [namePassword, setNamePassword] = useState({username: "", password: "", rememberMe: false});

    function handleNamePasswordChange(name, target) {
      setNamePassword((prevVal => ({
        ...prevVal,
        [name]:  target
      }))
      );
    }

    function checkLogIn(isLoggedIn) {
      if (isLoggedIn) {
        navigate("/home");
      }
    }

    function handleSubmit(event) {
      event.preventDefault();  
      gameService.loginPlayer(namePassword.username, namePassword.password, namePassword.rememberMe, checkLogIn);
    }

    //if user is already logged in then go to home
    useEffect(() => {
      gameService.checkLogin(checkLogIn);
    }, []);
  

    return (<div>
      <div className="input-box">
        <h3 >Login</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" className={"input-field"} onChange={event => handleNamePasswordChange(event.target.name, event.target.value)} placeholder="Username"/>
          <input type="password" name="password" className={"input-field"} onChange={event => handleNamePasswordChange(event.target.name, event.target.value)} placeholder="Password"/>
          <input type="checkbox" name="rememberMe" onChange={event => handleNamePasswordChange(event.target.name,event.target.checked)}/>
          <p>Remember Me</p> 
          <input type="submit" value="Login"/>
          
        </form>
      </div>
      
    </div>
   
   );
  
  }

export default Login;
  