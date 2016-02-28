'use strict';
var _ = require('underscore');

var nlp = require("nlp_compromise");
var ExtractKeywords = {};

ExtractKeywords.getKeywords = function(content, callback){
  var keywords = {};

  var text = content;
  var n = nlp.pos(text);
  var interests = cleanNames(n.nouns());
  var people = cleanNames(n.people());

  console.log( "cleaned people : " + people.length );
  console.log( "cleaned nouns : " + interests.length);

  keywords.people = people;
  keywords.interest = interests;

  //console.log(keywords.interests);
  //console.log(people);
  callback(null, keywords );
};


function cleanNames(inputNames){

  var m = {};
  inputNames = inputNames.map( function(it){
    return it.normalised;
  });

  inputNames = inputNames.map( function(it){
    return it.split('\'s')[0];
  });

  // remove single word names
  inputNames = inputNames.filter( function(it){
    return it.split(' ').length > 1;
  });

  // record count
  inputNames.map( function(it){
    if( m[it] === undefined){
      m[it] = 1;
    }
    else{
      m[ it ] = m[ it ] + 1;
    }
  });


  var nm = [];
  for( var key in m ){
    nm.push({ name : key, count : m[key] });
  }

  return _.sortBy(nm, "count" ).reverse();
}

module.exports = ExtractKeywords;
