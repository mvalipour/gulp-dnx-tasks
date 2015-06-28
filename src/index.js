var gutil = require('gulp-util');
var shell = require('gulp-shell');
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var ext = require('deep-extend');

var defaults = {
    test: {
        cmd: 'test',
        base: './test',
        watch: ['/**/*.cs']
    },
    web: {
        cmd: 'web',
        watch: ['/**/*.cs']
    }
};

function initTest(gulp, opts) {
    opts = ext({}, opts, defaults.test);

    var testDir = opts.base;
    var testDirs = fs.readdirSync(testDir).filter(function(f) {
      return fs.statSync(path.join(testDir, f)).isDirectory();
    });
    var testTasks = [];
    testDirs.forEach(function (d) {
        var cmd = 'dnx '+ opts.base + '/' + d + ' ' + opts.cmd;
        var tname = 'test_' + d;
        testTasks.push(tname);
        return gulp.task(tname, shell.task(cmd));
    });
    gulp.task('test', testTasks);
    gulp.task('test-watch', function () {
        testDirs.forEach(function (d) {
            var tname = 'test_' + d;
            var watchPaths = opts.watch.map(function (w) {
                return opts.base + '/' + d + w;
            });
            gulp.watch(watchPaths, [tname]);
        });
    });
}

function initWeb(gulp, opts) {
    opts = ext({}, opts, defaults.web);

    if(!opts.base) throw '`base` is missing from web options.';

    var webProcess;
    function restartWeb() {
        if(webProcess) {
            gutil.log('Stopping web server...');
            webProcess.kill();
            gutil.log('Stopped web server.');
        }

        gutil.log('Starting web server...');
        webProcess = spawn('dnx', [opts.base, opts.cmd]);
        gutil.log('Started web server.');
    };

    gulp.task('web', restartWeb);
    gulp.task('web-watch', function () {
        var watchPaths = opts.watch.map(function (w) {
            return opts.base + w;
        });
        gulp.watch(watchPaths, ['web']);
        restartWeb();
    });
}

module.exports.webTasks = initWeb;
module.exports.testTasks = initTest;
