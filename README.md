# gulp-dnx-tasks

A library that facilitates creating gulp tasks for asp.net dnx web apps.

There are generally two types of tasks that can be created using this:

- `test`: this will run all the test commands in all of your test projects with the option to watch files and re-run the tests for each project. (at the time of writing this, it is not possible to achieve this by `dnx` command line interface. See the issue here: [aspnet/dnx#2148](https://github.com/aspnet/dnx/issues/2148))
- `web`: this will run the web command for your web project with the option to watch files and re-start the command.

## usage

#### .webTasks(< gulp >, < options >);

options:
- `cmd` (defaults to `web`): dnx command to start the web server
- `base` (mandatory! no default): relative path to the web project root. e.g. `./src/my-web-app`
- `watch` (defaults tp `['/**/*.cs']`): files to watch on a watch task

#### .testTasks(< gulp >, < options >);

options:
- `cmd` (defaults to `test`): dnx command to run tests
- `base` (defaults to `./test`): relative path to the directory that contains test projects.
- `watch` (defaults tp `['/**/*.cs']`): files to watch on a watch task

for example:
```
var gulp = require('gulp');
var dnx = require('gulp-dnx-tasks');

dnx.webTasks(gulp, { base: './src/my-web-app' });
dnx.testTasks(gulp);
```

then you will have the following tasks defined:
```
$ gulp web
$ gulp web-watch
$ gulp test
$ gulp test-watch
```
