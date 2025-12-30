import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.html',
})
export class Footer {

  categories = ['News', 'Business', 'Politics','Sports', 'Entertainment', 'Tech'];

  constructor(private router: Router) {}

 filterByCategory(category: string) {
    this.router.navigate(['/home'], {
      queryParams: { category }
    });
  }
}
