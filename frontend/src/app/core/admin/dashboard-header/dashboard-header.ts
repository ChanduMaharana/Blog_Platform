import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './dashboard-header.html',
})
export class DashboardHeader {
  email = 'admin@example.com';

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }
}
