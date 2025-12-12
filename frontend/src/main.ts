import 'zone.js';
import { bootstrapApplication, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { LucideAngularModule, Facebook, Twitter, Linkedin, MessageCircle, Link } from 'lucide-angular';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,
      LucideAngularModule.pick({
        Facebook,
        Twitter,
        Linkedin,
        MessageCircle,
        Link,
      })
    ), provideClientHydration(withEventReplay()),
  ],
});
