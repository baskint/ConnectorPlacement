/*
 * GET home page.
 */
var fs = require('fs')


exports.index = function(req, res){
  var path = require('path');
  var readstream = fs.createReadStream(path.resolve(__dirname + '/../public/templates/index.html'));
  readstream.pipe(res)
};