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


exports.startsWith = startsWith = function(str, prefix) {
  return str.indexOf(prefix) === 0;
};

exports.endsWith = endsWith = function(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

exports.trim = trim = function(str) {
  return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,' ').replace(/\s+/g,' ');
};
  
exports.isForbiddenFileOrDirectory = isForbiddenFileOrDirectory = function(file) {
  return startsWith(file, '.') || endsWith(file, '~') || endsWith(file, '.desc');
};

exports.isForbiddenPath = function(path) {
  var tokens = path.split('/');
  for (t in tokens)
    if (isForbiddenFileOrDirectory(tokens[t])) return true;
  return false;
};