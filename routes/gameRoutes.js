const passport = require("passport");
const session = require("express-session");

const createJSON = require('../helperFunctions/createJSON');
const callGame = require('../helperFunctions/callGame');
const {Game, Player} = require('../models/Models');


module.exports = (app) => {

  app.use(session({
    secret: process.env.SECRET,
    resave: false, 
    saveUninitialized: false
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.use(Player.createStrategy());
  passport.serializeUser(Player.serializeUser());
  passport.deserializeUser(Player.deserializeUser());

  //Block to handle player data
  
  /**
   * Sends a list of the names and data of the users
   * 
   * @returns {Playerinfo|Array} - Array of the info of the players
   */
  app.get("/api/user", function(req, res) {
    Player.find({}, (err, players) => {
      if (err) {console.log(err); throw err;}
      if (players) {
        res.status(200);
        console.log(`${players.length} players were found and returned`);
        res.send(players);
      }
      else {
        res.status(200);
        console.log(`0 players were found and returned`);
        res.send([]);
      }
      
    });
  });


/**
 * Sends the information of a specific player
 * @param {string} id - Username of the player to get information of
 * 
 * @returns {Playerinfo} - Info of the specified player
 */
  app.get("/api/user/:id", function(req, res) {

    let playerName = req.query.id;

    Player.findOne({username: playerName}, (err, player) => {
      if (err) {console.log(err); throw err;};
      if (player) {
        console.log(`${player.usename} was found and returned`);
        res.status(200);
        res.send(player);
      }
      else {
        console.log(`${playerName} could not be found in the database`);
        res.status(400);
        res.send("");
      }
    });
  });
  //previous code handling all requests
  // app.get("/api/players/:id", function(req, res) {

  //   let playerName = req.query.playerName;
  //   let isMe = req.query.isMe;

  //   console.log(req.query);

  //   // console.log(`Value of playerName is ${typeof playerName} and isMe is ${typeof isMe}`);

  //   if (!playerName && !isMe) {
  //     Player.find({}, (err, players) => {
  //       if (err) {console.log(err); throw err;}
  //       res.status(200);
  //       console.log(`${players.length} players were found and returned`);
  //       res.send(players);
  //     });
  //   }
  //   else if (isMe) {
  //     if (!req.isAuthenticated()) {
  //       console.log("There is no logged in user to be found");
  //       res.status(400);
  //       res.send("");
  //     }
  //     else {
  //       Player.findOne({username: req.user.username}, (err, player) => {
  //         if (err) {console.log(err); throw err;}
  //         if (player) {
  //           console.log(`${req.user.username} player is the user currently logged in`);
  //           res.status(200);
  //           res.send(player);
  //         } else {
  //           console.log(`${req.user.username} is logged in but could not be found in the database`);
  //           res.status(400);
  //           res.send("");
  //         }
          
  //       });
  //     } 
  //   }
  //   else {
  //     Player.findOne({username: playerName}, (err, player) => {
  //       if (err) {console.log(err); throw err;};
  //       if (player) {
  //         console.log(`${player.usename} was found and returned`);
  //         res.status(200);
  //         res.send(player);
  //       }
  //       else {
  //         console.log(`${playerName} could not be found in the database`);
  //         res.status(400);
  //         res.send("");
  //       }
        
  //     });
  //   }    
  // });

  const addFriends = async function (user, friendsToAdd) {
    try {
      return await Player.find({}, (err, players) => {
        if (err) {console.log(err); throw err;}
        if (players) {
          const playersFound = players.reduce((total, current) => {
            total.push(current.username);
            return total;
          }, []);

          const playersToFriend = friendsToAdd.filter(value => playersFound.includes(value));
          if (playersToFriend.length !== 0) {
            console.log(`The players found that were in the database were ${playersToFriend}`);
            Player.updateOne({ username: user },
              { $push: { friendList: { $each: playersToFriend } } },
              {new: true}, 
              () => "UsersAdded"
            );
          }
          else {
            console.log("No player given could be found in the database, and therefore could not be added");
          }
        }      
      });
    }
    catch(err) { console.log(err) }
  }

  const removeFriends = async function (user, friendsToRemove) {
    try {
      return await Player.find({}, (err, players) => {
        if (err) {console.log(err); throw err;}
        if (players) {
          const playersFound = players.reduce((total, current) => {
            total.push(current.username);
            return total;
          }, []);
          
          const playersToFriend = friendsToRemove.filter(value => playersFound.includes(value));
          if (playersToFriend.length !== 0) {
            console.log(`The players found that were in the database were ${playersToFriend}`);
            Player.updateOne({ username: user },
              { $pull: { friendList: { $in: friendsToRemove } } },
              {new: true},
            () => "UsersFound");
          }
          else {
            return "None";
          }
        }      
      });
    }
    catch(err) { console.log(err) }
  }

  
  app.patch("/api/user/:id", function(req, res) {
    let friendsToAdd = req.body.addFriends;
    let friendsToRemove = req.body.removeFriends;

    let playerName = req.params.id;
    let friendsAddedInfo, friendsRemovedInfo;

    //A user must set their friends
    Player.findOne({username: playerName}, (err, player) => {
      if (err) {console.log(err); throw err;};
      if (player) {
        if (friendsToAdd) {
          friendsAddedInfo = addFriends(playerName, friendsToAdd);
        }
        if (friendsToRemove) {
          friendsRemovedInfo = removeFriends(playerName, friendsToRemove);
        }
        res.status(200);
        res.send(`Friends added info is ${friendsAddedInfo} and friends removed is ${friendsRemovedInfo}`);
      }
      else {
        res.status(400);
        res.send(`${playerName} was not found in the database`);
      }
    });
  });

  app.get("/api/player/me", function(req, res) {
    if (!req.isAuthenticated()) {
      console.log("There is no logged in user to be found");
      res.status(400);
      res.send("");
    }
    else {
      Player.findOne({username: req.user.username}, (err, player) => {
        if (err) {console.log(err); throw err;}
        if (player) {
          console.log(`${req.user.username} player is the user currently logged in`);
          res.status(200);
          res.send(player);
        } else {
          console.log(`${req.user.username} is logged in but could not be found in the database, which is super weird`);
          res.status(400);
          res.send("");
        }
        
      });
    }
  });

  //Creates a new player with given parameters
  app.post("/api/player/register", function(req, res) {

    let username = req.body.username;
    let password = req.body.password;

    Player.register({username: username}, password, function(err, user) {
      if (err) {
        res.status(400);
        console.log(`Error in creating user, error is ${err}`);
        res.send(err.name);
      } else {
        passport.authenticate("local")(req, res, function() {
          res.status(200);
          console.log(`User created is ${req.user}`);
          res.send("Success");
        })
      }
    })
  });

  //Login as the current player
  app.post("/api/player/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const rememberMe = req.body.rememberMe;

    
    // const user = new Player({
    //   username: username,
    //   password: password
    // });

    // passport.authenticate("local", (error, user, info) => {
    //   // console.log(req.body);
    //   // console.log("Error is " + error);
    //   // console.log("User is " + user);
    //   // console.log("Info is " + info);
    //   if (error) {
    //     res.status(401).send(error);
    //   } else if (!user) {
    //     res.status(401).send(info);
    //   } 
    // })(req, res, () => {
    passport.authenticate("local", (err, user, info) => {
      let IncorrectUsernameError = "IncorrectUsernameError";
      if (err) {
        console.log("There was an error in authenticating");
        console.log(err);
        res.status(400);
        res.send(err);
      }
      else if (user) {
        req.login(user, () => {
          res.status(200);
          if (rememberMe) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; //Cookie lasts for 30 days
          }
          else {
            req.session.cookie.expires = false; // Cookie expires at end of session
          }
          console.log(`User successfully logged in on backend login route, user is ${req.user.username}`);
          res.send("Success");
        });
      }
      else if (info === undefined || info === null){
        console.log(`The debug info when the info field isn't set is \n err: ${err} \n user: ${user} \n info: \"${info}\"`);
        res.status(400);
        res.send(err);
      }
      else if(IncorrectUsernameError === info.name) {
        console.log("Wrong user name or password");
        res.status(400);
        res.send(info.name);
      }
    })(req, res , () => {});
  });

    // req.login(user, function(err) {
    //   if (err) {
    //     res.status(404);
    //     console.log(`Error in loggin in user: ${err.name}`);
    //     res.send(err.name);
    //   } else {
    //     console.log("passport authenticate is called");
    //     passport.authenticate("local")(req, res, function() {
    //       res.status(200);
    //       // if (rememberMe) {
    //       //   req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; //Cookie lasts for 30 days
    //       // }
    //       // else {
    //       //   req.session.cookie.expires = false; // Cookie expires at end of session
    //       // }
    //       console.log(`User successfully logged in on backend login route, user is ${req.user}`);
    //       res.send(req.user);
    //     });
    //   }
    // })


  app.get("/api/player/logout", function(req, res) {
    console.log(`Before logout authenticated is ${req.isAuthenticated()}`);
    req.session.destroy((err) => {
      if(err) return (err) => console.log("There was an error destroying the session");
      console.log("The session should be destroyed");
      // req.logout();
      console.log(`After logout authenticated is ${req.isAuthenticated()}`);
      res.status(200);
      res.send("Logged out");
      
    });
    // res.status(204);
    // if (!req.isAuthenticated()) {
    //   console.log("In logout backend, user was logged out successfully");
    // }
    // else {
    //   console.log("In logout backend, user failed to log out");
    // }
  });

  app.get("/api/player/checklogin", function(req, res) {
    console.log("in checklogin");
    if (req.isAuthenticated()) {
      console.log("In checklogin backend, browser is currently logged in");
      res.status(200);
      res.send(true);
    }
    else {
      console.log("In checklogin backend, browser is not logged in");
      res.status(200);
      res.send(false);
    }
  });


  //Block to handle game data

  //Should return all the games with the logged in user, should return none if not logged in
  app.get("/api/games", function(req, res) {

    if (req.isAuthenticated()) {
      Game.find({players : {$all : [req.user.username]}}, (err, games) => {
        if (err) {console.log(err); throw err;}
        
        console.log(`${games.length} games were found and returned`);
        res.send(games);
      })
    } else {
      console.log("The showcase is being shown as the user is not logged in");
      Game.find({}, (err, games) => {
        if (err) {console.log(err); throw err;}
        
        console.log(`${games.length} games were found and returned`);
        res.send(games);
      })
    } 
  });


  //Should return the game with the given id
  app.get("/api/games/:id", function(req, res) {
    let id = req.params.id;

    Game.findOne({_id: id}, (err, game) => {
      if (err) {console.log(err); throw err;}
      
      console.log(`The game that was found is ${game}`);
      res.send(game);
    });
  });

  //Should create a new game at the given id given the parameters
  app.post("/api/games/:id", async function(req, res) {
    let id = req.params.id;

  

    //Check if a game with the id already exists. If it does, we deny the request
    Game.findOne({_id: id}, (err, game) => {
      if (!game) {
        let player1 = req.body.player1;
        let player2 = req.body.player2;
        let xDist = req.body.xDist;
        let yDist = req.body.yDist;
        let numToWin = req.body.numToWin;

        let player1String = player1.includes('&')? "UserPlayer" : "RandomPlayer";
        let player2String = player1.includes('&')? "UserPlayer" : "RandomPlayer";

        let options = {args: [String(player1String), String(player2String), String(xDist), String(yDist), String(numToWin)]};

        callGame(options, function(gameString) {

          gameResult = createJSON(gameString);

          gameResult._id = id;

          gameResult.players = [player1, player2];

          let newGame = Game(gameResult);
          newGame.save();

          console.log(`New game created with id ${id}`);
          res.send(gameResult);  
        });
      } else {
        res.send(`A game of tag ${id} already exists in the database`);
      }
    });
  });

  //This should play the game out with the given choice
  app.patch("/api/games/:id", function(req, res) {
    let id = req.params.id;

    let choice = req.query.choice;

    Game.findOne({_id: id}, (err, game) => {
      if (err) {console.log(err);}
      else if (game){ //Check if this game actually exists

        //check if valid choice
        if (game.winner !== 0) {
          res.send(`You cannot make a choice for this game, the game has already concluded,${
            game.winner === -1? `${game.winner} has won the game!`: "the game was a tie!"}`);
        }
        else if (choice >= game.choices.length) {
          res.send(`There are only ${game.choices.length} choices, your choice number was out of bounds`);
        }
        else {

          let options = {args: [JSON.stringify(game.game_json), choice]};

          callGame(options, function(gameString) {
            console.log(gameString);
            gameResult = createJSON(gameString);

            gameResult._id = id;

            Game.replaceOne({_id: id}, Game(gameResult), (rerr, rgame) => {
              if (rerr) {console.log(rerr); throw rerr;}
              console.log(`Game updated at id ${id}`);
              res.send(gameResult);  
            });    
          });
        }
      }
      else {
        res.send(`A game with id of ${id} currently does not exist`);
      }
    });
  });
}