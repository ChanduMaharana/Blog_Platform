import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { PostService, PostSummary } from '../../services/post-service';
import { PaginationComponent } from '../../shared/pagination/pagination';

@Component({
  selector: 'app-postlist',
  standalone: true,
  imports: [CommonModule, PaginationComponent, RouterModule],
  templateUrl: './postlist.html',
  styleUrls: ['./postlist.css'],
})
export class Postlist {
  posts: PostSummary[] = [];
  filteredPosts: PostSummary[] = [];

  trendingPosts: PostSummary[] = [];
  popularPosts: PostSummary[] = [];

  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 0;

  activeCategory: string | null = null;
  isCategoryView = false;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit() {
    this.postService.list().subscribe((posts: any[]) => {
      this.posts = posts.map(p => ({
        ...p,
        slug: p.slug,
        category: p.Category?.name || 'News'
      }));

      this.trendingPosts = [...this.posts].slice(0, 4);
      this.popularPosts = this.posts.filter(p => (p as any).popular);

      this.applyFilters();
    });

    this.route.queryParams.subscribe(() => {
      this.applyFilters();
    });
  }

  applyFilters() {
    const category = this.route.snapshot.queryParamMap.get('category');
    this.activeCategory = category;
    this.isCategoryView = !!category;

    this.filteredPosts = category
      ? this.posts.filter(
          p => p.category?.toLowerCase() === category.toLowerCase()
        )
      : this.posts;

    this.totalPages = Math.ceil(this.filteredPosts.length / this.itemsPerPage);
    this.currentPage = 1;
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  get paginatedPosts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPosts.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  viewPost(slug?: string) {
    if (!slug) return;
    this.router.navigate(['/post', slug]);
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
