import { Component, signal, computed } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Header } from './core/header/header';
import { Footer } from "./core/footer/footer";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css']

})
export class App {
  protected readonly title = signal('blog-platform');
  currentRoute = signal('');

  constructor(private router: Router) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.currentRoute.set(e.urlAfterRedirects);
      });
  }

  showLayout = computed(() =>
    !(
      this.currentRoute().startsWith('/admin') ||
      this.currentRoute().startsWith('/login')
    )
  );
}
