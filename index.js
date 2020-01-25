//jshint esversion:6

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
let {PythonShell} = require('python-shell');

const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


// IMPORT MODELS
// require('./models/Models');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//IMPORT ROUTES
require('./routes/gameRoutes')(app);  

//Redirects paths from the back end to the front end
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req,res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  });

}



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
})
