import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

import express from 'express';
import compression from 'compression';
import { join } from 'node:path';

const app = express();

app.use(compression());

const browserDistFolder = join(import.meta.dirname, '../browser');

const angularApp = new AngularNodeAppEngine();

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
    immutable: true,
  })
);

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  next();
});

app.use(async (req, res, next) => {
  try {
    const response = await angularApp.handle(req);

    if (response) {
      writeResponseToNodeResponse(response, res);
    } else {
      res.sendFile(join(browserDistFolder, 'index.html'));
    }
  } catch (err) {
    console.error('SSR Error:', err);
    res.sendFile(join(browserDistFolder, 'index.html'));
  }
});


if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;

  app.listen(port, () => {
    console.log(`🚀 Angular SSR server running at http://localhost:${port}`);
    console.log(`📦 Serving browser dist from: ${browserDistFolder}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);