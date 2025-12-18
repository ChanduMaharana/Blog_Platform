import 'zone.js/node';

import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { App } from './app/app';
import { routes } from './app/app.routes';

export default function bootstrap(context: BootstrapContext) {
  return bootstrapApplication(App, {
    providers: [
      provideServerRendering(),
      provideRouter(routes),
      provideHttpClient()
    ]
  }, context
);
}

export async function getPrerenderParams() {
  return {
    'posts/:id': [] 
  };
}