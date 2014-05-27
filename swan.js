var fis = module.exports = require('fis');

fis.cli.name = 'swan';
fis.cli.info = fis.util.readJSON(__dirname + '/package.json');

fis.config.merge({
    modules: {
        parser: {
            less: 'less',
            tmpl: 'bdtmpl'
        },
        postprocessor: {
            js: "jswrapper, require-async",
            html: "require-async"
        },
        prepackager : 'autoload'
    },
    roadmap: {
        ext: {
            less: 'css',
            tmpl: 'js'
        }
    },
    settings: {
        postprocessor: {
            jswrapper: {
                type: 'amd'
            }
        }
    }
});