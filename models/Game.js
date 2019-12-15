const mongoose = require('mongoose');
const {Schema} = mongoose;

//Set the schemas
const GameInfoSchema = new Schema ({
  _id: Number,
  choices: {},
  winner: Number,
  game_json: {type: {}, required: true}
});

const Game = mongoose.model("game", GameInfoSchema);

module.exports = Game;