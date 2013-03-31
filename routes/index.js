
/*
 * GET home page.
 */

 var config = require('../config')
 	, helpers = require('../helpers')
 	;

 var fs = require('fs')
   , util = require('util')
   , path = require('path')
   , join = require('path').join
  ;

function removeHidden(files) {
  return files.filter(function(file){
    return !isForbidden(file);
  });
}

function isForbidden(file) {
  return '.' == file[0];
}

function getTimeText(time) {
  var mtime = new Date(time),day = mtime.getDate(), month = mtime.getMonth(), hours = mtime.getHours(), minutes = mtime.getMinutes(); if (day < 10) day = '0' + day; if (hours < 10) hours = '0' + hours; if (minutes < 10) minutes = '0' + minutes
  return ('' + day + '-' + config.MONTHS[month] + '-' + mtime.getFullYear() + ' ' + hours + ':' + minutes);
}

function getHeaderEntry(n, m, s, d) {
  var header = {};
  header.Name = 'Name';
  header.LastModified = 'Last modified';
  header.Size = 'Size';
  header.Description = 'Description';
  header.icon = path.join(config.ICONS_PATH, 'blank.png');
  header.alt = '';

  header.NameURL = 'D';
  header.LastModifiedURL = 'A';
  header.SizeURL = 'A';
  header.DescriptionURL = 'A';

  if (n == 'D') header.NameURL = 'A';
  else if (n == 'A') header.NameURL = 'D';
  if (m == 'D') header.LastModifiedURL = 'A';
  else if (m == 'A') header.LastModifiedURL = 'D';
  if (s == 'D') header.SizeURL = 'A';
  else if (s == 'A') header.SizeURL = 'D';
  if (d == 'D') header.DescriptionURL = 'A';
  else if (d == 'A') header.DescriptionURL = 'D';

  header.NameIndent = '                                                ';
  header.LastModifiedIndent = '      ';
  header.SizeIndent = '  ';
  header.DescritpionIndent = '';


  return header;
}

function getExtension(filename) {
  var extenion = '   ';
  try {
    extenion = path.extname(filename).substring(1).toUpperCase();
  } catch (err) {
    console.log(err);
  }
  return extenion;
}

function getIcon(ext) {
  if (ext == 'TXT' || ext == 'RTF') return 'text.png';
  else if (ext == 'PDF') return 'pdf.png';
  else return "generic.png";
}

function getFilename(filename) {
  if (config.MAX_FILENAME_LENGTH - filename.length <= 0) {
    return filename.substr(0, config.MAX_FILENAME_LENGTH - 3) + '..>';
  }
  return filename;
}

// TODO : dynamicaaly generate the Parent Directory based on 
function getParentDirectory() {
  var p = {};
  p.alt = '[   ]';
  p.icon = path.join(config.ICONS_PATH, 'blank.png');
  p.url = '..';
  p.name = getFilename(config.PARENT_DIRECTORY_NAME);
  p.description = config.PARENT_DIRECTORY_DESCRIPTION;
  p.indent = getNameIndent(p.name);
  p.size = '  - ';
  p.mtime = '                 ';
  return p;
}

function getSizeText1(bytes) {
  var sizes = ['B', 'K', 'M', 'G', 'T'];
  if (bytes == 0) return '  0B';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  var size = (bytes / Math.pow(1024, i));
  var precision = 1;
  if (size >= 10) {
    precision = 0;
  }
  var ret = size.toFixed(precision) + sizes[i];
  return ret.length < 4 ? ' ' + ret : ret;
}

function getNameIndent(filename) {
  var name_width = config.MAX_FILENAME_LENGTH - filename.length;
  var width = '  '
  if (name_width > 0) {
      while(name_width-- > 0) width = width + ' ';
  }
  return width;
}

function getSizeText(bytes) {
  var size = bytes, unit = 'B';
  
  if (bytes > (1024 * 1024 * 1024 * 1024) - 1)  { size = bytes / (1024 * 1024 * 1024 * 1024); unit = 'T' }
  else if (bytes > (1024 * 1024 * 1024) - 1)  { size = bytes / (1024 * 1024 * 1024); unit = 'G' }
  else if (bytes > (1024 * 1024) - 1)  { size = bytes / (1024 * 1024); unit = 'M' }
  else if (bytes > 1024 - 1)  { size = bytes / 1024; unit = 'k' }

  if(size>10) {size = size.toFixed(0);} else {size = size.toFixed(1);}
  
  if ( (''+ size).length == 2 )  size = ' ' + size;
  else if ( (''+ size).length == 1 )  size = '  ' + size;

  return size + unit;
}

var perform = function(Path, Dirs, Files, N, M, S, D) {
  var sorted = sortEntries(Dirs, Files, N, M, S, D);
  var files = sorted.files;
  var dirs = sorted.dirs;

  for(d in dirs) {
    dirs[d].alt = '[DIR]';
    dirs[d].icon = path.join(config.ICONS_PATH, 'dir.png');
    dirs[d].url = dirs[d].name + '/';
    dirs[d].name = getFilename(dirs[d].name + '/');
    dirs[d].indent = getNameIndent(dirs[d].name);
    dirs[d].size = '  - ';
    dirs[d].mtime = getTimeText(dirs[d].mtime);
  }
  for(f in files) {
    var ext = getExtension(files[f].name);
    files[f].alt = '[' + ext + ']';
    files[f].icon = path.join(config.ICONS_PATH, getIcon(ext));
    files[f].url = files[f].name;
    files[f].name = getFilename(files[f].name);
    files[f].indent = getNameIndent(files[f].name);
    files[f].size = getSizeText1(files[f].size);
    files[f].mtime = getTimeText(files[f].mtime);
  }

  var parent = getParentDirectory();
  var entries = dirs.concat(files);
  entries.unshift(parent);
  return entries;
}

var sortEntries = function(dirs, files, N, M, S, D) {
  if(N == 'D') {
    dirs.sort(helpers.descName);
    files.sort(helpers.descName);
  } else if(M == 'A') {
    dirs.sort(helpers.ascModified);
    files.sort(helpers.ascModified);
  } else if(M == 'D') {
    dirs.sort(helpers.descModified);
    files.sort(helpers.descModified);
  } else if(S == 'A') {
    dirs.sort(helpers.ascName);
    files.sort(helpers.ascSize);
  } else if(S == 'D') {
    dirs.sort(helpers.ascName);
    files.sort(helpers.descSize);
  } else if(D == 'A') {
    dirs.sort(helpers.ascName);
    files.sort(helpers.ascName);
    dirs.sort(helpers.ascDescription);
    files.sort(helpers.ascDescription);
  } else if(D == 'D') {
    dirs.sort(helpers.ascName);
    files.sort(helpers.ascName);
    dirs.sort(helpers.descDescription);
    files.sort(helpers.descDescription);
  } else {
    dirs.sort(helpers.ascName);
    files.sort(helpers.ascName);
  }
  return {dirs: dirs, files: files};
}



exports.list = function(req, res) {
  var requested_path = req.params[0];
  var normalized_path = path.normalize(requested_path);
  var root = path.join(__dirname, '..', config.REPOSITORY_PATH);
  var physical_path = path.join(root, requested_path);
  var F = [];
  var D = [];

  if(helpers.isForbiddenPath(requested_path)) {
    res.writeHead(404); res.end();
    return;
  }
  if (~requested_path.indexOf('\0')) {
    res.writeHead(400); res.end(); // bad request
    return;
  }

  // to prevent multiple trailing slashes
  if (normalized_path != '.' && requested_path != normalized_path) {
    
    // abort with error
    res.writeHead(400); res.end(); return;
    
    // redirecting to a normalized path
    res.redirect(path.normalize(requested_path)); return;
  }
  
  fs.stat(physical_path, function(err, stat) {
    if(err || typeof stat == 'undefined') {
      res.writeHead(404); res.end();
    }
    else {
      if (stat.isDirectory()) {
        // append '/' to directory URLs
        if (requested_path != '' && helpers.endsWith(requested_path, '/') == false) {
          res.redirect(req.url + '/');
          return;
        }
        fs.readdir(physical_path, function (err, files) {
          files = removeHidden(files);
          var count = files.length;
          if (count == 0) {
            var header = getHeaderEntry(req.param('N'), req.param('M'), req.param('S'), req.param('D'));
            var entries = perform(requested_path, D, F, req.param('N'), req.param('M'), req.param('S'), req.param('D'));

            res.render('list', { path: '/' + requested_path, entries: entries, header: header});
          }
          else {
            files.forEach(function (file) {
              if (helpers.isForbiddenFileOrDirectory(file)) {
                --count;
                return;
              }
              fs.stat(physical_path + '/' + file, function (err, s) {
                var finfo = {name: file, mtime: s.mtime, description: ''};
                fs.readFile(physical_path + '/.' + file + '.desc', function(err, data) {
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
                    var header = getHeaderEntry(req.param('N'), req.param('M'), req.param('S'), req.param('D'));
                    var entries = perform(requested_path, D, F, req.param('N'), req.param('M'), req.param('S'), req.param('D'));

                    res.render('list', { path: '/' + requested_path, entries: entries, header: header});
                  }
                });
              });
            });
          }
        });
      } else if (stat.isFile()) {
        // a file is being requested
        res.sendfile(physical_path);
      } else {
        res.writeHead(404); res.end(); return;
      }
    }
  });


}
