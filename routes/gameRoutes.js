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
  //IMPORTANT DISABLE BEFORE PRODUCTION
  app.get("/api/players", function(req, res) {
    Player.find({}, (err, players) => {
      if (err) {console.log(err); throw err;}

      console.log(`${players.length} players were found and returned`);
      res.send(players);
    });
  });

  //Creates a new player with given parameters
  app.post("/api/players/register", function(req, res) {

    let userName = req.body.username;
    let passWord = req.body.password;


    Player.register({username: userName}, passWord, function(err, user) {
      if (err) {
        res.status(409);
        console.log(`Error in creating user: ${err.name}`);
        res.send(err.name);
      } else {
        passport.authenticate("local")(req, res, function() {
          res.status(200);
          console.log(`User created is ${req.user}`);
          res.send(req.user);
        })
      }
    })
  });

  //Login as the current player
  app.post("/api/players/login", function(req, res) {
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
     passport.authenticate("local")(req, res, () => {
      res.status(200);
      // if (rememberMe) {
      //   req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; //Cookie lasts for 30 days
      // }
      // else {
      //   req.session.cookie.expires = false; // Cookie expires at end of session
      // }
      console.log(`User successfully logged in on backend login route, user is ${req.user.username}`);
      res.send(req.user);
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
  });

  app.get("/api/players/logout", function(req, res) {

    req.session = null;
    res.status(204);
    console.log("The session should be destroyed");
    // req.session.destroy((err) => {
    //   if(err) return (err) => console.log("There was an error destroying the session");
    //   console.log("The session should be destroyed");
    //   // req.logout();
    //   res.status(204);
    // });
    // res.status(204);
    // if (!req.isAuthenticated()) {
    //   console.log("In logout backend, user was logged out successfully");
    // }
    // else {
    //   console.log("In logout backend, user failed to log out");
    // }
  });

  app.get("/api/players/checklogin", function(req, res) {
    if (req.isAuthenticated()) {
      console.log("In checklogin backend, browser is currently logged in");
      res.send(true);
    }
    else {
      console.log("In checklogin backend, browser is not logged in");
      res.send(false);
    }
  }) 


  //Block to handle game data

  //Should return all the games with the logged in user, should return none if not logged in
  app.get("/api/games", function(req, res) {

    // passport.authenticate("local")(req, res. function() {
    //   req.user
    // })

    Game.find({}, (err, games) => {
      if (err) {console.log(err); throw err;}
      
      console.log(`${games.length} games were found and returned`);
      res.send(games);
    });
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

        let options = {args: [String(player1), String(player2), String(xDist), String(yDist), String(numToWin)]};

        callGame(options, function(gameString) {

          gameResult = createJSON(gameString);

          gameResult._id = id;

          let newGame = Game(gameResult)  ;
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