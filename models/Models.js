const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
const {Schema} = mongoose;


//Mongoose set up
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tictactoeDB',
 {
  useUnifiedTopology: true,
  useNewUrlParser: true
})
.catch((err) => {
  console.log(err);
});             

mongoose.set('useCreateIndex', true);

//Set the schemas
const GameInfoSchema = new Schema ({
  _id: Number,
  choices: {},
  winner: Number,
  players: [String],
  game_json: {type: {}, required: true}
});
GameInfoSchema.plugin(passportLocalMongoose);

const PlayerInfoSchema = new Schema ({
  friendList: [String],
  password: String
});

PlayerInfoSchema.plugin(passportLocalMongoose);

const Game = mongoose.model("game", GameInfoSchema);

const Player = mongoose.model("player", PlayerInfoSchema);


module.exports = {Game, Player};