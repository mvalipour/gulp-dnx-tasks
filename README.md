# gulp-dnx-tasks

A library that facilitates creating gulp tasks for asp.net dnx web apps.

There are generally two types of tasks that can be created using this:

- `test`: this will run all the test commands in all of your test projects with the option to watch files and re-run the tests for each project. (at the time of writing this, it is not possible to achieve this by `dnx` command line interface. See the issue here: [aspnet/dnx#2148](https://github.com/aspnet/dnx/issues/2148))
- `web`: this will run the web command for your web project with the option to watch files and re-start the command.

## Usage

```
npm install gulp-dnx-tasks --save-dev
```

```js
var gulp = require('gulp');
var dnx = require('gulp-dnx-tasks');

dnx.webTasks(gulp);
   .testTasks(gulp);
```

then you will have the following tasks defined:
```
$ gulp web
$ gulp web-watch
$ gulp test
$ gulp test-watch
```

## API

#### .webTasks(< gulp >, < options >);

options:
- `cmd` (defaults to `web`): dnx command to start the web server
- `base` (defaults to the only project with web command): relative path
to the web project root. e.g. `./src/my-web-app`
- `watch` (defaults to `['./src/**/*.cs']`): files to watch on a watch task.  
   *Note:* You can use `{project}` in the path to refer to the root of the web project.

#### .testTasks(< gulp >, < options >);

options:
- `cmd` (defaults to `test`): dnx command to run tests
- `watch` (defaults tp `['{project}/**/*.cs']`): files to watch on a watch task.  
   *Note:* You can use `{project}` in the path to refer to the root of the web project.
