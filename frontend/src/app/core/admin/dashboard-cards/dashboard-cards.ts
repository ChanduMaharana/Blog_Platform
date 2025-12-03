import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../../services/post-service';
import { CategoryService } from '../../../services/category-service';
import { BannerService } from '../../../services/banner-service';

@Component({
  selector: 'app-dashboard-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-cards.html',
})
export class DashboardCards implements OnInit {

  postCount: number = 0;
  categoryCount: number = 0;
  bannerCount: number = 0;

  constructor(
    private postService: PostService,
    private categoryService: CategoryService,
    private bannerService: BannerService
  ) {}

  ngOnInit(): void {
    this.loadCounts();
  }

  loadCounts() {
    this.postService.list().subscribe((posts) => {
      this.postCount = posts.length;
    });

    this.categoryService.getAll().subscribe((cats) => {
      this.categoryCount = cats.length;
    });

    this.bannerService.getAll().subscribe((banners) => {
      this.bannerCount = banners.length;
    });
  }
}
