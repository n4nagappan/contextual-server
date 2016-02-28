'use strict';

var Bing = require('node-bing-api')({ accKey: "jafGfcVP+whrxGyhA4TxxCKG6gtcaXOCg0ufZbSdO90" });

Bing.composite("xbox wikipedia", {
    top: 10,  // Number of results (max 15 for news, max 50 if other) 
    skip: 3,   // Skip first 3 results 
    sources: "web", //Choises are web+image+video+news+spell 
    newsSortBy: "Date" //Choices are Date, Relevance 
  }, function(error, res, body){
    console.log(body.d.results[0]);
  });
