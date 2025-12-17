import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule, HttpClientModule],
  templateUrl: './login.html'
})
export class Login {
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

onLogin() {
  this.auth.login(this.email, this.password).subscribe({
    next: (res) => {
      this.auth.saveToken(res.token);
      this.router.navigate(['/admin/dashboard']);
    },
    error: (err) => {
      alert(err.error.message || 'Login failed');
    },
  });
}
}
