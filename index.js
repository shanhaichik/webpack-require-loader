var loaderUtils = require("loader-utils");
var path = require("path");
var glob = require('glob');

module.exports = function (source, map) {
    this.cacheable && this.cacheable();

    var params  = loaderUtils.parseQuery(this.query);
    var context = this.context;
    var content = source;

    var reg = /(\/\/@require\s("(.*)"))/mg;
    var requirePaths = [];

    while ((url = reg.exec(source)) !== null) {
        var sourceParh = url[3];

        if(sourceParh[sourceParh.length-1] === '*') {
            sourceParh += '.*';
        }

        var files = glob.sync(sourceParh, { cwd: context });

        this.addContextDependency(path.dirname(url[3]));

        files.forEach(function(file) {
            var _file = path.join(context, file);
            var importString = '';

            if(params.hasOwnProperty('params')) {
                importString = 'params=>'+params.params+',';
            }

            if(params.import && Array.isArray(params.import)) {
                importString += params.import.join(',');

                content += '\n require("imports?'+importString+'!'+_file+'"); \n';
            }
            else{
                content += '\n require(_file'+importString.length ? importString : {}+'); \n';
            }
        });
    }
    this.callback(null, content, map);
}