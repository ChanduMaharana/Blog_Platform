import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-header',
  imports: [FormsModule],
  templateUrl: './header.html',
})
export class Header {
  searchTerm = '';

  constructor(private router: Router) {}

  onSearch() {
    if (!this.searchTerm.trim()) return;
    this.router.navigate(['/posts'], {
      queryParams: { q: this.searchTerm }
    });
  }
}
