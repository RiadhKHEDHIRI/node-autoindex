
exports.MAX_FILENAME_WIDTH = 50;
exports.MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
exports.PARENT_DIRECTORY_NAME = 'Parent Directory';
exports.PARENT_DIRECTORY_DESCRIPTION = 'Agonizing memories';

exports.isForbiddenFileOrDirectory = function(file) {
  return startsWith(file, '.') || endsWith(file, '~') || endsWith(file, '.desc');
};