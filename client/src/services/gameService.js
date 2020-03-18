import axios from 'axios';

export default {
  getAllGames: async () => {
    let res = await axios.get(`/api/games`);
    return res.data || [];
  },

  getAllPlayers: async () => {
    let res = await axios.get('/api/user');
    return res.data || [];
  },

  getPlayer: async (playerName, callBack) => {
    let res = await axios.get(`/api/user/${playerName}`);
    callBack(res.data);
    return res.data || [];
  },

  getMe: async (callBack) => {
    let res = await axios.get('/api/player/me');
    callBack(res.data);
    return res.data || [];
  },

  addFriends: async (user, friendsToAdd, callBack) => {
    let params = {
      addFriends: typeof friendsToAdd === "string"? [friendsToAdd]: friendsToAdd
    };
    let res = await axios.patch(`/api/user/${user}`, params)
    .catch(error => console.log(`The error we caught was ${error}`));
    console.log("The response we got was " + res.data);
    callBack && callBack(res.data);
    return res.data || [];
  },
  removeFriends: async (user, friendsToRemove, callBack) => {
    let params = {
      removeFriends:  typeof friendsToRemove === "string"? [friendsToRemove]: friendsToRemove
    };
    let res = await axios.patch(`/api/user/${user}`, params)
    .catch(error => console.log(`The error we caught was ${error}`));
    callBack && callBack(res.data);
    return res.data || [];
  },
  registerPlayer: async (username, password, callback) => {
    let params = {
      username: username,
      password: password
    };
    let res = await axios.post('/api/player/register', params)
    .then(response => {
      callback(response.data);
      return response.data || [];
    })
    .catch(error => {
      console.log("An error occured while sending a post request to /api/player/register");
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
      callback(error.response.data);
      return error.response.data || [];
    });
    
  }, 
  loginPlayer: async (username, password, rememberMe, callback) => {
    let params = {
      username: username,
      password: password,
      rememberMe: rememberMe
    };
    // let res = await axios.post('/api/player/login', params)
    let res = await axios.post('/api/player/login', params)
    .then(response => {
      callback(response.data);
      return response.data || [];
    })
    .catch(error => {
      console.log("An error occured while sending a post request to /api/player/login");
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(`error response data is: ${error.response.data}`);
        console.log(`error response status is: ${error.response.status}`);
        console.log(`error response header is ${JSON.stringify(error.response.headers)}`);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
      callback(error.response.data);
      return error.response.data;
    });
    
   
  },
  checkLogin: async (callBack) => {
    let res = await axios.get("/api/player/checklogin")
    .catch(error => {
      console.log("An error occured while sending a post request to /api/player/checklogin");
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
      console.log("These is the debug info for checkLogin");
    });
    callBack(res.data);
    return res.data || []
  },
  logoutPlayer: async (callBack) => {

    let res = await axios.get('/api/player/logout')
    .then(callBack())
    .catch(error => {
      console.log("An error occured while sending a post request to /api/player/logout");
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
      console.log("These is the debug info for logoutPlayer");
    });
    
    console.log(res);
    return res.data || [];
  }

  
}