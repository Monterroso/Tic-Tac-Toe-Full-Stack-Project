// /client/src/setupProxy.js

const proxy = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const logout = require('express-passport-logout');


module.exports = function(app) {
    app.use(proxy("/api/**", { target: 'http://localhost:5000' }));
    app.use(bodyParser.json()); 
    app.use(bodyParser.urlencoded({extended: true}));
    app.get('logout', logout());
}