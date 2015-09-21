var gutil = require('gulp-util');
var shell = require('gulp-shell');
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var ext = require('deep-extend');
var glob = require('glob');

var defaults = {
    test: {
        cmd: 'test',
        watch: ['{project}/**/*.cs']
    },
    web: {
        cmd: 'web',
        watch: ['./src/**/*.cs']
    }
};

function getCommands() {
    gutil.log('Reading configuration files...');
    var files = glob.sync("./**/project.json", {});
    gutil.log('Found', files.length, 'projects:');
    var commands = {};
    files.forEach(function (f) {
        var config = JSON.parse(fs.readFileSync(f).toString().trim());
        for(var c in config.commands) (commands[c] || (commands[c] = [])).push(f);
    });
    for(var c in commands) gutil.log('[' + c + ']', commands[c].length, 'projects.');

    return commands;
}

var commands = getCommands();

function processPath(path, dir) {
    return path.replace('{project}', dir);
}

function initTest(gulp, opts) {
    opts = ext({}, opts, defaults.test);

    var testTasks = [];
    var testDirs = commands[opts.cmd] || [];
    testDirs.forEach(function (d) {
        var dir = path.dirname(d);
        var cmd = 'dnx -p '+ dir + ' ' + opts.cmd;
        var tname = 'test_' + dir;
        testTasks.push(tname);
        return gulp.task(tname, shell.task(cmd));
    });
    gulp.task('test', testTasks);
    gulp.task('test-watch', function () {
        testDirs.forEach(function (d) {
            var dir = path.dirname(d);
            var tname = 'test_' + dir;
            var watchPaths = opts.watch.map(function (w) {
                return processPath(w, dir);
            });
            gulp.watch(watchPaths, [tname]);
        });
    });

    return this;
}

function initWeb(gulp, opts) {
    opts = ext({}, opts, defaults.web);

    if(!opts.base){
        var webProjs = commands[opts.cmd] || [];
        if(webProjs.length === 0) throw 'There are no projects with a web command.';
        if(webProjs.length > 1) throw 'There are more than one projects with web commands. Please specify base command.';

        opts.base = webProjs[0];
    }
    if(!opts.base) throw '`base` is missing from web options.';

    var webProcess;
    function restartWeb() {
        if(webProcess) {
            gutil.log('Stopping web server...');
            webProcess.kill();
            gutil.log('Stopped web server.');
        }

        gutil.log('Starting web server...');
        webProcess = spawn('dnx', ['-p', opts.base, opts.cmd]);
        gutil.log('Started web server.');
    };

    gulp.task('web', restartWeb);
    gulp.task('web-watch', function () {
        var watchPaths = opts.watch.map(function (w) {
            return processPath(w, opts.base);
        });
        gulp.watch(watchPaths, ['web']);
        restartWeb();
    });

    return this;
}

module.exports.webTasks = initWeb;
module.exports.testTasks = initTest;
