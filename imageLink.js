var url = 'https://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&format=json&titles=Image:';
var request = require('request');
function getWikiLink(name, cb){

  request(url + name, function(err, res, body){
    var obj = JSON.parse(body);
    var imageUrl = extractImageLink( obj.query.pages );
    return cb(null, imageUrl);
  });
}

function extractImageLink(obj){
  for( key in obj ){
    return obj[key].imageinfo[0].url;
  }
}

module.exports = getWikiLink;
