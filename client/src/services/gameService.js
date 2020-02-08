import axios from 'axios';

export default {
  getAllGames: async () => {
  //   let res = await axios({
  //     method: 'get',
  //     url: '/api/games'
  //   });
  //   return res.data || [];

    let res = await axios.get(`/api/games`);
    return res.data || [];
  },

  getAllPlayers: async () => {
    let res = await axios.get('/api/players');
    return res.data || [];
  },

  registerPlayer: async (username, password, callback) => {
    let params = {
      username: username,
      password: password
    };
    let res = await axios.post('/api/players/register', params)
    .catch(error => {
      console.log("An error occured while sending a post request to /api/players/register");
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
      console.log("These is the debug info for registerPlayer");
    });
    callback(res.data);
    return res.data || [];
  }, 
  loginPlayer: async (username, password, rememberMe, callback) => {
    let params = {
      username: username,
      password: password,
      rememberMe: rememberMe
    };
    let res = await axios.post('/api/players/login', params)
    .catch(error => {
      console.log("An error occured while sending a post request to /api/players/login");
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
      console.log("These is the debug info for loginPlayer");
    });
    console.log("This is the info we got back " + res.data);
    callback(res.data);
    return res.data || [];
  },
  checkLogin: async (callBack) => {
    let res = await axios.get('/api/players/checklogin').catch(error => {
      console.log("An error occured while sending a post request to /api/players/checklogin");
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
    console.log(`CheckLogin called, status of login is ${res.data}`)
    callBack(res.data);
    return res.data || []
  },
  logoutPlayer: async (callBack) => {

    let res = await axios.get('/api/players/logout')
    .then(callBack())
    .catch(error => {
      console.log("An error occured while sending a post request to /api/players/logout");
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