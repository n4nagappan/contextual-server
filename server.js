'use strict';

var request = require('request');
var extractor = require('unfluff');
var restify = require('restify');
var extractKeywords = require('./lib/extractKeywords.js');
var DEFAULT_URL = 'http://www.newyorker.com/magazine/2015/02/23/shape-things-come';
var DEFAULT_TERM = 'Jonathan Ive';

var wikiParser = require('wiki-infobox-parser');

//var DEFAULT_URL = 'http://waitbutwhy.com/2014/09/muhammad-isis-iraqs-full-story.html';
 
var server = restify.createServer({
  name: 'contextual'
});

server.use(restify.queryParser());
//server.use(restify.bodyParser());
 
server.get('/contents', function (req, res, next) {
  var url = req.params.url;
  //console.log( url );

  request(url || DEFAULT_URL , function(err, urlRes, body){
      if(err){
          return next(err);
      }

      var data = extractor(body);
      extractKeywords.getKeywords(data.text, function(err, keywords){
        data.extractedKeywords = keywords;
        console.log( keywords.interest);
        return res.send(data);
      });
  });
});


server.get('/search', function(req, res, next){
  var term = req.params.q || DEFAULT_TERM ;
  //console.log( term);

  wikiParser('Jonathan Ive', function(err, result) {
    if (err) {
      console.error(err.message);
    } else {
      console.log(result);
      res.send( result );
    }
  });
  //var wikiUrl = 'https://en.wikipedia.org/wiki/Special:Search?search=' + encodeURIComponent(term);
  //request( wikiUrl , function(err, urlRes, body){
  //    if(err){
  //        return next(err);
  //    }

  //    var data = extractor(body);
 
  //    res.send(data.text);
  //});
});
 
server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
