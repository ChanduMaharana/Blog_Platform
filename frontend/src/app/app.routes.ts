import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Postlist } from './core/postlist/postlist';
import { Postdetails } from './core/postdetails/postdetails';
import { AdminDashboard } from './core/admin/admin-dashboard/admin-dashboard';
import { Login } from './core/login/login';
import { AuthGuard } from './services/auth/auth.guard';
import { postResolver } from './shared/post.resolver';

export const routes: Routes = [
  
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: Home },

  { path: 'posts', component: Postlist },
  // { path: 'posts/:id', component: Postdetails },
   {
    path: 'post/:id',
    loadComponent: () =>
      import('./core/postdetails/postdetails')
        .then(m => m.Postdetails),
    resolve: { post: postResolver }
  },

  { path: 'login', component: Login },

  { path: 'admin/dashboard', component: AdminDashboard, canActivate: [AuthGuard] },

  { path: '**', redirectTo: 'home' }
];

