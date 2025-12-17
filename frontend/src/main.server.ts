import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { App } from './app/app';
import { routes } from './app/app.routes';

export default function bootstrap(context: any) {
  return bootstrapApplication(
    App,
    {
      providers: [
        provideServerRendering(),
        provideRouter(routes),
        provideHttpClient()
      ]
    },
    context 
  );
}
