import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { PostService, PostSummary } from '../../services/post-service';
import { PaginationComponent } from '../../shared/pagination/pagination';
import { PostCard } from '../../layout/post-card/post-card';

@Component({
  selector: 'app-postlist',
  standalone: true,
  imports: [CommonModule, PaginationComponent, RouterModule, PostCard],
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
  searchQuery: string | null = null;

  isCategoryView = false;
    isSearchView = false; 

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
    const q = this.route.snapshot.queryParamMap.get('q')?.trim();
    const category = this.route.snapshot.queryParamMap.get('category');

    this.searchQuery = q || null;
    this.activeCategory = category;

    this.isSearchView = !!q;
    this.isCategoryView = !!category && !q;

    this.filteredPosts = this.posts.filter(p => {
      const matchesCategory = category
        ? p.category?.toLowerCase() === category.toLowerCase()
        : true;

      const matchesSearch = q
        ? p.title?.toLowerCase().includes(q.toLowerCase()) ||
          p.description?.toLowerCase().includes(q.toLowerCase()) ||
          p.content?.toLowerCase().includes(q.toLowerCase())
        : true;

      return matchesCategory && matchesSearch;
    });

    this.totalPages = Math.ceil(this.filteredPosts.length / this.itemsPerPage);
    this.currentPage = 1;
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  get paginatedPosts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPosts.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
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

