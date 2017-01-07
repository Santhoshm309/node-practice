(function(){

    module.exports = function(app){
        app.use('/techofes',require('../server/router/api'));
        console.log('Hi');

    };

})();
