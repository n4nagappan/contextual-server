var InfoBoxExtractor  = {};
var infobox = require('wiki-infobox');
var request = require('request');
var getImageLink = require('./imageLink.js');
 
var page = 'ben carson';
var language = 'en';
 
var normalizationUrl = 'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=';
var snippetExtractionUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts|pageimages&exintro=&explaintext=&titles=';

InfoBoxExtractor.extract = function(keyword , cb){
  var response = {};

  request(normalizationUrl + keyword, function( err, res, body ){
    if(err){
      return cb(err);
    } 

    var searchResults;
    try{
      console.log( body );
      searchResults = JSON.parse(body).query.search;
    }
    catch(e){
      console.log( e );
      return cb("KEYWORD_SEARCH_ERROR");
    }

    if(searchResults.length == 0){
      return cb("NO_SEARCH_RESULTS");
    } 

    var title = searchResults[0].title;

    console.log("Normalized : " + title);
    request(snippetExtractionUrl + title, function( err, res, body ){
    var obj;

      try{
        console.log( body );
        obj = extractSnippet(JSON.parse(body).query.pages);
      }
      catch(e){
        console.log( e );
      }

      if( typeof obj === "undefined" ){
        return cb("EXTRACTION_FAILED");
      }

      response.snippet = obj.extract;
      console.log("Snippet : " + response.snippet);
      console.log("Page Image : " + obj.pageimage);

      if( obj.pageimage ){
        getImageLink(obj.pageimage, function(err, imageUrl){
          response.image = imageUrl;
          return cb(null, response);
        });
      }
      else{
          return cb(null, response);
      }

    });
  });

};

function extractSnippet(obj){
  for( key in obj ){
    return obj[key];
  }
}

//InfoBoxExtractor.extract(page, function(err, infoJson){
//  console.log( infoJson );
//});

module.exports = InfoBoxExtractor;

// Sample data
  // { 
  //   box_length: '275px', 
  //   name: 
  //     { 
  //       type: 'text', 
  //       value: 'Warsaw Metro<br>\'\'Metro Warszawskie\'\'' 
  //     }, 
  //   owner: 
  //    { 
  //      type: 'text', 
  //      value: 'City of Warsaw' 
  //    }, 
  //   locale: 
  //    [ { type: 'link', 
  //        text: 'Warsaw', 
  //        url: 'http://en.wikipedia.org/wiki/Warsaw' }, 
  //      { type: 'link', 
  //        text: 'Poland', 
  //        url: 'http://en.wikipedia.org/wiki/Poland' } ], 
  //   transit_type: 
  //    { type: 'link', 
  //      text: 'Rapid transit', 
  //      url: 'http://en.wikipedia.org/wiki/Rapid transit' }, 
  //   lines: '1<ref name', 
  //   stations: '21<ref name', 
  //   ridership: '568,000 <small>(2012; ave. weekday)</small><ref name', 
  //   annual_ridership: '139.17 million <small>(2012)</small><ref name', 
  //   website: '{{url|www.metro.waw.pl|Metro Warszawskie}}', 
  //   began_operation: '1995', 
  //   operator: 'Metro Warszawskie', 
  //   marks: '', 
  //   vehicles: '', 
  //   system_length: '{{convert|22.7|km|mi|1|abbr', 
  //   track_gauge: 
  //    { type: 'link', 
  //      text: 'standard gauge', 
  //      url: 'http://en.wikipedia.org/wiki/standard gauge' }, 
  //   map: 
  //    { type: 'image', 
  //      text: 'frameless', 
  //      url: 'http://en.wikipedia.org/wiki/File:Metro w Warszawie 1 linia.svg' }, 
  //   map_name: '', 
  //   map_state: '}}' 
  // } 
