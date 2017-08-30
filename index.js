var loaderUtils = require("loader-utils");
var fs = require('fs');
var path = require("path");
var glob = require('glob');
var slash = require('slash');

/**
 * @param  {string} source
 * @return {string}
 */
module.exports = function(source, map) {
  this.cacheable && this.cacheable();

  var query = loaderUtils.getOptions(this) || {};
  var context = this.context;
  var content = source;

  var regJS = /\s*\/\/\s*@(require|require-loader)*\s+(["'](.*)["']).*/mg;
  var regCSS = /\s*@(require|require-loader)*\s+(["'](.*)["']).*/mg;
  var regCSSImport = /\s*@(import|import-loader)*\s+(["'](.*)["']).*/mg;
  var cssExtensions = ['.scss', '.sass', '.css', '.styl', '.less'];
  var contentToInject = "";

  while ((importUrl = regCSSImport.exec(source)) !== null) {
    var importPath = path.join(context, importUrl[3]);
    if(!fs.existsSync(importPath)) {
      importPath = importUrl[3];
    }
    content = content.replace(importUrl[0], '@import "' + importPath + '";');
  }

  while ((url = regJS.exec(source)) !== null || (url = regCSS.exec(source)) !== null) {
    var patternAndQuery = getPatternAndQuery(url);
    var importsString = getImportsString(query, patternAndQuery.query);

    // Find all the files matching the pattern.
    var files = glob.sync(patternAndQuery.pattern, {
      cwd: context
    });

    var self = this;
    files.forEach(function(file) {
      self.addDependency(file);

      var filePath = slash(path.join(context, file));

      if (cssExtensions.indexOf(path.extname(filePath)) !== -1) {
        contentToInject += '\n@import "' + filePath + '";\n';
      } else {
        contentToInject += '\nrequire("'+ importsString + filePath +'");\n';
      }
    });
  }

  content = content.replace(regCSS, contentToInject);
  content = content.replace(regJS, contentToInject);

  this.callback(null, content, map);
};

function getPatternAndQuery(url) {
  var pattern;
  var query;

  // Get the pattern and the query object.
  if (url[3].indexOf('?') !== -1) {
    var _url = url[3].split('?');
    pattern = _url[0];
    query = loaderUtils.parseQuery('?' + _url[1]);
  } else {
    pattern = url[3];
    query = {};
  }

  if (pattern[pattern.length - 1] === '*') {
    pattern += '.*';
  }

  return {
    pattern: pattern,
    query: query
  };
}

function getImportsString(query, sourceQuery) {
  var imports = [];
  imports = imports.concat(getImportsFromQuery(query));
  imports = imports.concat(getImportsFromQuery(sourceQuery));

  var importsString = "";
  if (imports.length) {
    importsString = "imports-loader?" + imports.join(',') + "!";
  }

  return importsString;
}

function getImportsFromQuery(query) {
  var imports = [];

  Object.keys(query).forEach(function(key) {
    if (key !== "import") {
      return imports.push(key + "=>" + query[key]);
    }

    if (Array.isArray(query.import)) {
      imports = imports.concat(query.import);
    }
  });

  return imports;
}
