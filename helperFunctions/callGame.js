//This function creates a game given parameters
const { PythonShell } = require("python-shell");
const path = require("path");

function callGame(options, callback) {
  let pyshell = new PythonShell(path.join(__dirname, "../", "public/Python/python_controller.py"), options);

  let gameResult;
  
  pyshell.on('message', function (message) {
    gameResult = message;
  });

  pyshell.end(function (err, code, signal) {
    if (err) {console.log(err); throw err;}
    callback(gameResult);
  });
}

module.exports = callGame;