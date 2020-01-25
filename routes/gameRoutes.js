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
        console.log(err);
        res.send("There was an error registering the player in question");
      } else {
        passport.authenticate("local")(req, res, function() {
          res.send("The player was successfully registered");
        })
      }
    })
  });

  //Login as the current player
  app.post("/api/players/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const user = new Player({
      username: username,
      password: password
    });

    req.login(user, function(err) {
      if (err) {
        console.log(err);
        res.send("There was an error while logging in");
      } else {
        passport.authenticate("local")(req, res, function() {
          res.send("You have successfully logged in!");
        });
      }
    })
  });

  app.post("/api/players/logout", function(req, res) {
    req.logout();
    res.send("You have succesfully logged out");
  })


  //Block to handle game data

  //Should return all the games
  app.get("/api/games", function(req, res) {
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