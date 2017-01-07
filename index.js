(function(){

   var express = require('express');
   var mongoose = require('mongoose');
   var app = express();

   var routes = require('./server')(app);


   app.listen(8080);
   console.log("Server is running at port  : "+ 8080);
   module.exports = app;

})();
