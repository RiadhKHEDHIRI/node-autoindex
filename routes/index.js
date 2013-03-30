
/*
 * GET home page.
 */

 var config = require('../config')
 	, helpers = require('../helpers')
 	;

 var fs = require('fs')
   , util = require('util')
   , paths = require('path')
  ;

exports.index = function(req, res){
  var F = [];
  var D = [];
  var path = paths.join(__dirname, '../public/', req.params[0]);
 // var path = app.set('repository') + '/' + req.params[0];
  console.log(path);
  if (helpers.isForbiddenPath(req.params[0])) {
    //res.render('404', {status: 404, url: req.url});
    console.log(req.params[0] + ' isForbiddenPath');
    res.writeHead(404); res.end();
  } else {
    fs.stat(path, function (err, stat) {
      if (err || typeof stat == 'undefined') {
        //res.render('404', {status: 404, url: req.url});
        console.log(path + ' is problematic');
        res.writeHead(404); res.end();
      }
      else {
        if (stat.isDirectory()) {
          if (req.params[0] != '' && endsWith(req.params[0], '/') == false) {
            res.redirect(req.url + '/');
            return;
          }
          fs.readdir(path, function (err, files) {
            var count = files.length;
            for(f in files) {
              (function foo(file) {
                if (helpers.isForbiddenFileOrDirectory(file)) {
                  --count;
                  return;
                }
                fs.stat(path + '/' + file, function (err, s) {
                  var finfo = {name: file, size: '-', mtime: s.mtime, description: ''};
                  fs.readFile(path + '/.' + file + '.desc', function(err, data) {
                    if (!err) {
                      finfo.description = helpers.trim(data.toString('utf8'));
                    }
                    if (s.isDirectory()) {
                      D.push(finfo);
                    } else if (s.isFile()) {
                      finfo.size = s.size;
                      F.push(finfo);
                    }
                    if (--count === 0) {
                      if(req.param('N') == 'D') {
                        D.sort(helpers.descName);
                        F.sort(helpers.descName);
                      } else if(req.param('M') == 'A') {
                        D.sort(helpers.ascModified);
                        F.sort(helpers.ascModified);
                      } else if(req.param('M') == 'D') {
                        D.sort(helpers.descModified);
                        F.sort(helpers.descModified);
                      } else if(req.param('S') == 'A') {
                        D.sort(helpers.ascName);
                        F.sort(helpers.ascSize);
                      } else if(req.param('S') == 'D') {
                        D.sort(helpers.ascName);
                        F.sort(helpers.descSize);
                      } else if(req.param('D') == 'A') {
						            D.sort(helpers.ascName);
                        F.sort(helpers.ascName);
                        D.sort(helpers.ascDescription);
                        F.sort(helpers.ascDescription);
                      } else if(req.param('D') == 'D') {
						            D.sort(helpers.ascName);
                        F.sort(helpers.ascName);
                        D.sort(helpers.descDescription);
                        F.sort(helpers.descDescription);
                      } else {
                        D.sort(helpers.ascName);
                        F.sort(helpers.ascName);
                      }
                      res.render('index', { title: '/' + req.params[0], n: req.param('N'), m: req.param('M'), s: req.param('S'), d: req.param('D'), dirs: D, files: F, path: '/' + req.params[0],formatHead: helpers.formatHead, formatBody: helpers.formatBody});
                    }
                  });
                });
              })(files[f]);
            }
            if (count <= 0) {
                res.render('index', { title: '/' + req.params[0], n: req.param('N'), m: req.param('M'), s: req.param('S'), d: req.param('D'), dirs: [], files: [], path: '/' + req.params[0], formatHead: helpers.formatHead, formatBody: helpers.formatBody});
            }
          });
        } else if (stat.isFile()) {
          res.sendfile(path);
        }
      }
    });
  }
};