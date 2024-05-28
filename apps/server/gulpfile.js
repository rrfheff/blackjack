const { spawn } = require('child_process');
const path = require('path');
const { dest, series, watch } = require('gulp');
const ts = require('gulp-typescript');
const alias = require('gulp-path-alias');

const tsProject = ts.createProject('tsconfig.json');
/**
 * Build using tsc
 * @return {WritableStream} pipe to dist folder.
 */
function build() {
  const tsRlt = tsProject
    .src()
    .pipe(
      alias({
        paths: {
          '@server': path.resolve(__dirname, './src'),
        },
      }),
    )
    .pipe(tsProject());
  return tsRlt.js.pipe(dest('dist'));
}

// Spawn node process
let nodeApp = null;
/**
 * Restart node server process, kill if exist
 * @return {Promise} restart node server.
 */
function reStartServer() {
  return new Promise(resolve => {
    if (nodeApp) {
      nodeApp.kill();
    }

    nodeApp = spawn('node', ['./dist/index.js'], {
      stdio: 'inherit',
    });
    nodeApp.on('close', code => {
      if (code === 8) {
        console.log('Error detected, fix then retry');
      }
    });
    resolve();
  });
}

// Kill process on exit
process.on('exit', () => {
  if (nodeApp) {
    nodeApp.kill();
  }
});

// Gulp watch src file changes
/**
 * Watch changes of ts and json files
 * @param {cb} cb back function
 */
function watchChange(cb) {
  watch(
    [
      './src/**/*.ts',
      './src/**/*.graphql',
      './config/*.env',
      './src/**/*.json',
      './*.json',
      './.env',
    ],
    {
      ignored: [],
    },
    series(build, reStartServer),
  );
  cb();
}

exports.default = series(build, reStartServer, watchChange);
