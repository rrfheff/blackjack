import morgan from 'morgan';
import express, { Request, Response, NextFunction } from 'express';
// @ts-expect-error
import bodyParser from 'body-parser';
import requireDirectory from 'require-directory';
import { flattenObject } from './utils/common';

const app = express();

// Express configuration
app.set('port', process.env.PORT || 3001);
app.disable('x-powered-by');
app.set('etag', 'strong');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const option: morgan.Options<Request, Response> = {
  skip: (req: Request) => /health-shallow/.test(req.url),
};
app.use(morgan('combined', option));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Content-Type', 'application/json');
  next();
});

/**
 * Primary app routes.
 */
const apis = requireDirectory(module, './api');
const apiPath = flattenObject(apis);
Object.entries(apiPath).forEach(([key, value]) => {
  const method = key.split('/').pop() as 'get' | 'post' | 'put' | 'delete';
  const path = key.slice(0, key.lastIndexOf('/'));
  if (!['get', 'post', 'put', 'delete'].includes(method)) {
    console.error(`Invalid method: ${method}, path: ${path}`);
    return;
  }
  app[method](`/${path}`, value);
});

app.get('/getResult', (req, res) => {
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
  });
  res.flushHeaders();
  // Send an event every second
  setTimeout(() => {
    res.write(`data: ${new Date().toISOString()}\n\n`);
  }, 1000);
});

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log(
    '> ✅ 🎉 🚀 🍻 Server is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env'),
  );
  console.log('  Press CTRL-C to stop\n');
});
