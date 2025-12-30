import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-us.html',
})
export class ContactUs {

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/home']);
  }

  submit() {
    alert('Message submitted (demo)');
  }
}
