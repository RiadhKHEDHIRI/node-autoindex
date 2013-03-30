var config = require('./config')
  ;

exports.ascName = function(a, b) {
  if (a.name < b.name) return -1;
  else if (a.name > b.name) return 1;
  else return 0;
};

exports.descName = function(a, b) {
  if (a.name > b.name) return -1;
  else if (a.name < b.name) return 1;
  else return 0;
};

exports.ascModified = function(a, b) {
  if (a.mtime < b.mtime) return -1;
  else if (a.mtime > b.mtime) return 1;
  else return 0;
};

exports.descModified = function(a, b) {
  if (a.mtime > b.mtime) return -1;
  else if (a.mtime < b.mtime) return 1;
  else return 0;
};

exports.ascSize = function(a, b) {
  if (a.size < b.size) return -1;
  else if (a.size > b.size) return 1;
  else return 0;
};

exports.descSize = function(a, b) {
  if (a.size > b.size) return -1;
  else if (a.size < b.size) return 1;
  else return 0;
};

exports.ascDescription = function(a, b) {
  if (a.description < b.description) return -1;
  else if (a.description > b.description) return 1;
  else return 0;
};

exports.descDescription = function(a, b) {
  if (a.description > b.description) return -1;
  else if (a.description < b.description) return 1;
  else return 0;
};


startsWith = function(str, prefix) {
  return str.indexOf(prefix) === 0;
};

endsWith = function(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

exports.trim = trim = function(str) {
  return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');
};
  
exports.isForbiddenFileOrDirectory = config.isForbiddenFileOrDirectory;

exports.isForbiddenPath = function(path) {
  var tokens = path.split('/');
  for (t in tokens)
    if (config.isForbiddenFileOrDirectory(tokens[t])) return true;
  return false;
};

exports.formatHead = function (n, m, s, d) {
  var name_width = config.MAX_FILENAME_WIDTH - 2;
  var width = ''
  while(name_width-- > 0) width = width + ' ';
  
  var n_order = 'A', m_order = 'A', s_order = 'A', d_order = 'A';
  if (n == 'D') n_order = 'A';
  if (n == 'A') n_order = 'D';
  if (m == 'D') m_order = 'A';
  if (m == 'A') m_order = 'D';
  if (s == 'D') s_order = 'A';
  if (s == 'A') s_order = 'D';
  if (d == 'D') d_order = 'A';
  if (d == 'A') d_order = 'D';
  
  var txt = ' <a href="?N=' + n_order  + '">Name</a>' + width + '<a href="?M='+m_order+'">Last modified</a>' + '      ' + '<a href="?S='+s_order+'">Size</a>' + '  ' + '<a href="?D=' + d_order + '">Description</a>' + '';
  return {alt: '', img: '/icons/blank.png', url: '..', text: txt};
  //'                                            '
};

var formatDirectories = function(path, dirs) {
  var ret = [];
  var p = {alt: '[   ]', img: '/icons/blank.png', url: '../', name: config.PARENT_DIRECTORY_NAME, text: ''};
  
  var buf = ' ';
  var name_width = config.MAX_FILENAME_WIDTH - config.PARENT_DIRECTORY_NAME.length;
  var width = ''
  if (name_width > 0) {
    while(name_width-- > 0) width = width + ' ';
    buf += width;
  } else {
    p.name = config.PARENT_DIRECTORY_NAME.substr(0, config.MAX_FILENAME_WIDTH - 3) + '..>'
  }
  buf += ' ';
  buf += '                     -   ';
  buf += config.PARENT_DIRECTORY_DESCRIPTION;
  p.text = buf; // + '\n';
  ret.push(p);
  for (d in dirs) {
    var o = {alt: '[DIR]', img: '/icons/dir.png', url: path + dirs[d].name + '/', name: dirs[d].name + '/', text: ''};
    var buf = ' ';
    var name_width = config.MAX_FILENAME_WIDTH - dirs[d].name.length - 1;
    var width = ''
    if (name_width > 0) {
      while(name_width-- > 0) width = width + ' ';
      buf += width;
    } else {
      o.name = dirs[d].name.substr(0, config.MAX_FILENAME_WIDTH - 3) + '..>'
      buf += ' ';
    }
  o.name = o.name.replace('&', '&amp;');
  o.url = o.url.replace('&', '&amp;');
    buf += ' ';
    var mtime = new Date(dirs[d].mtime),day = mtime.getDate(), month = mtime.getMonth(), hours = mtime.getHours(), minutes = mtime.getMinutes(); if (day < 10) day = '0' + day; if (hours < 10) hours = '0' + hours; if (minutes < 10) minutes = '0' + minutes
    buf += '' + day + '-' + config.MONTHS[month] + '-' + mtime.getFullYear() + ' ' + hours + ':' + minutes;
    buf += '  ' + '  - ' + '  ' + dirs[d].description;
    //buf += '\n';
    o.text = buf;
    ret.push(o);
  }
  return ret;
};

var getIconFromFilename = function(filename) {
  return 'generic.png';
};

var bytesToSize = function(bytes) {
  var sizes = ['B', 'k', 'M', 'G', 'T'];
  if (bytes == 0) return '0B';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

var formatFiles = function(path, files) {
  var ret = [];
  for (d in files) {
    var filename = files[d].name;
    var fileext = '   ';
    try {
      fileext = path_module.extname(filename).substring(1).toUpperCase();
    } catch (err) {
      console.log(err);
    }
//    console.log(filename);
//    console.log(fileext);
    var o = {alt: '['+ fileext  + ']', img: '/icons/' + getIconFromFilename(filename), url: path + files[d].name, name: files[d].name, text: ''};
    var buf = ' ';
    var name_width = config.MAX_FILENAME_WIDTH - files[d].name.length;
    var width = ''
    var size = files[d].size, unit = 'B';

    if (files[d].size > 1024 - 1)  { size = files[d].size / 1024; unit = 'k' }
    if (files[d].size > (1024 * 1024) - 1)  { size = files[d].size / (1024 * 1024); unit = 'M' }
    if (files[d].size > (1024 * 1024 * 1024) - 1)  { size = files[d].size / (1024 * 1024 * 1024); unit = 'G' }

    if(size>10) {size = size.toFixed(0);} else {size = size.toFixed(1);}
    
//    if (size >= 100) size  = Math.ceil(size)
    if ( (''+ size).length == 1 )  size = '  ' + size;
    if ( (''+ size).length == 2 )  size = ' ' + size;
    if (name_width > 0) {
      while(name_width-- > 0) width = width + ' ';
      buf += width;
    } else {
      o.name = files[d].name.substr(0, config.MAX_FILENAME_WIDTH - 3) + '..>'
    }
  o.name = o.name.replace('&', '&amp;');
  o.url = o.url.replace('&', '&amp;');
//  console.log(o.name);
    buf += ' ';
    var mtime = new Date(files[d].mtime),day = mtime.getDate(), month = mtime.getMonth(), hours = mtime.getHours(), minutes = mtime.getMinutes(); if (day < 10) day = '0' + day; if (hours < 10) hours = '0' + hours; if (minutes < 10) minutes = '0' + minutes
    buf += '' + day + '-' + config.MONTHS[month] + '-' + mtime.getFullYear() + ' ' + hours + ':' + minutes;
    buf += '  ' + size + unit + '  ' + files[d].description;
//    buf += '\n';
    o.text = buf;
    ret.push(o);
  }
  return ret;
};

exports.formatBody = function(path, dirs, files) {
  var d = formatDirectories(path, dirs);
  var f = formatFiles(path, files);
  var r = d.concat(f);
  return r;
}