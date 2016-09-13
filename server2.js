'use strict';

const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();


var request = require('request');
var extractor = require('unfluff');
var restify = require('restify');
var extractKeywords = require('./lib/extractKeywords.js');

// Debug later var DEFAULT_URL = 'http://www.nytimes.com/2015/12/13/us/politics/ted-cruz-surges-past-donald-trump-to-lead-in-iowa-poll.html';
var DEFAULT_TERM = 'Jonathan Ive';

var wikiParser = require('wiki-infobox-parser');
var infoBoxExtractor = require('./InfoBoxExtractor.js');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



// serve static assets normally
app.use(express.static(__dirname + '/public'));

app.get('/contents', function (req, res, next) {
  var url = req.query.url;
  console.log( "requested url : " + url );

  request(url , function(err, urlRes, body){
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


app.get('/people/:person', function(req, res, next){
  console.log( req.params.person );
  infoBoxExtractor.extract(req.params.person, function(err, response){
    if(err){
      res.send({snippet:""});
    }
    res.send(response);
  });
});

app.get('/search', function(req, res, next){
  var term = req.query.q || DEFAULT_TERM ;
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


// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', function (request, response){
  console.log("serving index.html");
  response.sendFile(path.resolve(__dirname, 'public', 'index.html'));
})


app.listen(port);
console.log("server started on port " + port);
