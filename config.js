
exports.REPOSITORY_PATH = './public'; // relative to this file
exports.ICONS_PATH = '/icons'; // relative to the website root
exports.TRAILING_STRING = '..>';
exports.MAX_FILENAME_LENGTH = 50;
exports.MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
exports.PARENT_DIRECTORY_NAME = 'Parent Directory';
exports.PARENT_DIRECTORY_DESCRIPTION = 'Sweet memories';

exports.isForbiddenFileOrDirectory = function(file) {
  return startsWith(file, '.') || endsWith(file, '~') || endsWith(file, '.desc');
};