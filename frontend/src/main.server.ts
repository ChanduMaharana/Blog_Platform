import { provideServerRendering } from '@angular/platform-server';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { bootstrapApplication } from '@angular/platform-browser';

export default function bootstrap() {
  return bootstrapApplication(App, {
    providers: [
      provideServerRendering(),   
      provideRouter(routes),
      provideHttpClient()
    ]
  });
}
