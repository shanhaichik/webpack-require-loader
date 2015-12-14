var loaderUtils = require("loader-utils");
var path = require("path");
var glob = require('glob');

function has (obj, key) {
    return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * @param  {string} source
 * @return {string}
 */
module.exports = function (source, map) {
    this.cacheable && this.cacheable();

    var params  = loaderUtils.parseQuery(this.query);
    var context = this.context;
    var content = source;

    var regJS         = /(\/\/@require\s("(.*)"))/mg;
    var regCSS        = /(@require\s("(.*)";))/mg;
    var regCSSImport  = /(@import\s("(.*)";))/mg;
    var extPrecedence = ['.scss', '.sass', '.css','.styl'];
    var requirePaths  = [];

    while ((importUrl = regCSSImport.exec(source)) !== null) {
        content = content.replace(importUrl[0],'@import "'+path.join(context, importUrl[3])+'";');
    }

    while ((url = regJS.exec(source)) !== null || (url = regCSS.exec(source)) !== null) {
        var sourcePath, sourceQuery = null;

        if(!!~url[3].indexOf('?')) {
            var _url = url[3].split('?');
            sourcePath  = _url[0],
            sourceQuery = loaderUtils.parseQuery('?'+_url[1]);
        }
        else {
            sourcePath = url[3];
        }

        if(sourcePath[sourcePath.length-1] === '*') {
            sourcePath += '.*';
        }

        var files = glob.sync(sourcePath, { cwd: context });

        files.forEach(function(file) {
            var _file = path.join(context, file);
            var importString = '';
            var _import = [];

            this.addDependency(file);

            if(has(params,'params')) {
                importString += 'params=>'+params.params+',';
            }

            if(has(params,'import') && Array.isArray(params.import)) {
                _import = _import.concat(params.import);
            }

            if(sourceQuery && Object.keys(sourceQuery).length) {
                for(var key in sourceQuery) {
                    if(has(sourceQuery, key) && key !== 'import') {
                        importString += key+'=>'+sourceQuery[key]+',';
                    }
                    else if(has(sourceQuery, key) && key === 'import'){
                        _import = _import.concat(sourceQuery[key]).filter(function(item, pos, self){
                            return self.indexOf(item) == pos;
                        });
                    }
                }
            }

            if(!!~extPrecedence.indexOf(path.extname(_file))){
                content += '\n @import "'+_file+'";\n';
            }
            else{
                if(_import.length) {
                    importString += _import.join(',');
                    content += '\n require("imports?'+importString+'!'+_file+'"); \n';
                }
                else{
                    content += '\n require('+_file+''+importString.length ? importString : {}+'); \n';
                }
            }
        }, this);
    }
    content = content.replace(regCSS,'');
    content = content.replace(regJS,'');

    this.callback(null, content, map);
}