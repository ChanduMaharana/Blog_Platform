import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  imports: [CommonModule],
  templateUrl: './privacy-policy.html',
})
export class PrivacyPolicy {
constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/home']);
  }
}
