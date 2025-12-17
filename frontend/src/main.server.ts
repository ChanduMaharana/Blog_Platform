import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { bootstrapApplication } from '@angular/platform-browser';

export default function bootstrap() {
  return bootstrapApplication(App, {
    providers: [
      provideRouter(routes),
      provideHttpClient()
    ]
  });
}
