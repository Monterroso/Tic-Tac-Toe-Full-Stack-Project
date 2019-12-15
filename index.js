//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
let {PythonShell} = require('python-shell');


// IMPORT MODELS
require('./models/Game');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Redirects paths from the back end to the front end
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req,res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })

}

//Mongoose set up
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tictactoeDB',
 {
  useUnifiedTopology: true,
  useNewUrlParser: true
})
.catch((err) => {
  console.log(err);
});

//IMPORT ROUTES
require('./routes/gameRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
})
