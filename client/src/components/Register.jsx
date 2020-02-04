import React, { useState } from "react";

// SERVICES
import gameService from '../services/gameService';

function Register() {
    const [namePassword, setNamePassword] = useState({username: "", password: ""});

    function handleNamePasswordChange(name, target) {
      setNamePassword((prevVal => ({
        ...prevVal,
        [name]:  target
      }))
      );
    }

    function handleSubmit(event) {
      event.preventDefault();    
      gameService.registerPlayer(namePassword.username, namePassword.password);
    }
   
    return (<div>
      <p>Register</p>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" onChange={event => handleNamePasswordChange(event.target.name, event.target.value)} placeholder="Username"/>
          <input type="password" name="password" onChange={event => handleNamePasswordChange(event.target.name, event.target.value)} placeholder="Password"/>
          <input type="submit" value="Submit"/>
        </form>
    </div>
   
   );
}
  
export default Register;