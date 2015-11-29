'use strict';

var request = require('request');
var extractor = require('unfluff');
var restify = require('restify');
var url = 'http://www.newyorker.com/magazine/2015/02/23/shape-things-come';
 
var server = restify.createServer({
  name: 'contextual'
});

server.use(restify.queryParser());
//server.use(restify.bodyParser());
 
server.get('/contents', function (req, res, next) {
  res.send(req.params);

  request(url, function(err, res, body){
      if(err){
          return next(err);
      }
      data = extractor(my_html_data);
      console.log(data);
      return next(data);
  });
});
 
server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
