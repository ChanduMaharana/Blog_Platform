import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

import express from 'express';
import compression from 'compression';
import path, { join } from 'node:path';

const app = express();

app.use(compression());

const browserDistFolder = join(import.meta.dirname, '../browser');

const angularApp = new AngularNodeAppEngine();

/**
 * Serve static files (JS, CSS, images)
 * High cache age ensures better performance
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
    immutable: true,
  })
);

/**
 * Improve initial response time on Railway/Vercel/Render by preventing cold-start delay.
 * Adds small caching headers for SSR HTML pages.
 */
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  next();
});

/**
 * Handle server-side rendering for all other routes
 */
app.use(async (req, res, next) => {
  try {
    const response = await angularApp.handle(req);

    if (response) {
      writeResponseToNodeResponse(response, res);
    } else {
      next();
    }
  } catch (err) {
    console.error('SSR Error:', err);
    next(err);
  }
});


/**
 * Start the server (Railway compatible)
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;

  app.listen(port, () => {
    console.log(`🚀 Angular SSR server running at http://localhost:${port}`);
    console.log(`📦 Serving browser dist from: ${browserDistFolder}`);
  });
}

/**
 * Export handler for Angular CLI dev-server or serverless platforms
 */
export const reqHandler = createNodeRequestHandler(app);
