var express= require('express');
var app = express();
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080; // set the port for our app
var User = require('./app/models/user');
// APP CONFIGURATION ---------------------
 // use body parser so we can grab information from POST requests14 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(bodyParser.json());

 // configure our app to handle CORS requests
 app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
 res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
 Authorization');
 next();
 });

 // log all requests to the console
 app.use(morgan('dev'));

 // ROUTES FOR OUR API
 // =============================

 // basic route for the home page
 app.get('/', function(req, res) {
 res.send('Welcome to the home page!');
 });

 mongoose.createConnection('mongodb://localhost:27017/users');
 // get an instance of the express router
 var apiRouter = express.Router();

apiRouter.use(function(req,res,next) {

  console.log("Somebody");
  next();
});



  app.use('/api', apiRouter);

 apiRouter.route('/users')

 .post(function(req,res) {

   var user= new User();
   user.name = req.body.name;
   user.username = req.body.username;
   user.password = req.body.password;

   user.save(function(err) {
     if(err)
     {
       if(err.code==11000)
          return res.json({success: false, message: 'A user with that username already exists'});
        else
         {
          return res.send(err);
        }
     }
      res.json({message: 'USer created'});
   });
 })

 // START THE SERVER
 // ===============================
 app.listen(port);
 console.log('Magic happens on port ' + port);
