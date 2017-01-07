(function() {

var express= require('express');
var app = express();
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('../../app/models/user');
var jwt = require('jsonwebtoken');
var apiRouter = express.Router();

var superSecret = 'techofespollpage';
 app.use(bodyParser.json());
app.use(function(req, res, next) {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
   Authorization');
   next();
 });
 app.use(morgan('dev'));

mongoose.createConnection('mongodb://localhost:27017/users');


apiRouter.route('/authenticate')

.post(function(req,res) {
  User.findOne({

    username: req.body.username
  }).select('name username password').exec(function(err, user){

    if(err) throw err;
    if(!user) {
      res.json({
        success: false,
        message: 'Authorization failed'
      });
    }else if (user) {

      var validPassword = user.comparePassword(req.body.password);
if(!validPassword) {
    res.json({
      success: false,
      message: 'wrong pass'
    });
  } else {

    var token = jwt.sign({
      name: user.name,
      username: user.username
    }, superSecret);

    res.json({
      success: true,
      token: token
    });
  }

    }

  });

})

apiRouter.use(function(req,res,next) {

console.log('request');

  if (token) {
   var token = req.body.token || req.query.token || req.headers['x-access-token'];

   jwt.verify(token, superSecret, function(err, decoded) {
   if (err) {
   return res.status(403).send({
   success: false,
   message: 'Failed to authenticate token.'
   });
   } else {
   req.decoded = decoded;

   next();

   }
   });

   } else {

   return res.status(403).send({
   success: false,
   message: 'No token provided.'
   });

   }
});



//express-jwt
//passportjs




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

apiRouter.route('/users/:user_id')

.get(function(req,res) {
    User.findById(req.params.user_id,function(err,user) {

      if(err) res.send(err);

      res.json(user);
    });

})

apiRouter.get('/me', function(req, res) {
   res.send(req.decoded);
});

module.exports = apiRouter;
})();
