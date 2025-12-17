import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from '../categories.component/categories.component';
import { BannerComponent } from '../banner.component/banner.component';
import { PostComponent } from '../post.component/post.component';
import { DashboardHeader } from "../dashboard-header/dashboard-header";
import { DashboardCards } from "../dashboard-cards/dashboard-cards";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule, PostComponent, CategoriesComponent, BannerComponent, DashboardHeader, DashboardCards],
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard {
  tab: 'posts' | 'categories' | 'banners' = 'posts';
}
