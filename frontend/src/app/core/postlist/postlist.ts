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

  constructor(
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller 
  ) {}

  ngOnInit() {
    this.postService.list().subscribe(posts => {
      console.log('RAW POSTS FROM API:', posts);

      this.posts = posts.map(p => ({
        ...p,
        slug: p.slug
      }));

      console.log('POSTS AFTER MAP:', this.posts);

      this.applySearchFilter(); 

      this.trendingPosts = [...this.posts]
        .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
        .slice(0, 4);

      this.popularPosts = this.posts.filter(p => (p as any).popular);
    });

    this.route.queryParams.subscribe(() => {
      this.applySearchFilter(); 
    });
  }

  applySearchFilter() {
    const q = this.route.snapshot.queryParamMap
      .get('q')
      ?.toLowerCase()
      .trim();

    this.filteredPosts = q
      ? this.posts.filter(p =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.content?.toLowerCase().includes(q)
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
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.viewportScroller.scrollToPosition([0, 0]); 
  }

  viewPost(slug?: string) {
    console.log('CLICKED SLUG:', slug);
    if (!slug) return;
    this.router.navigate(['/post', slug]);
    this.viewportScroller.scrollToPosition([0, 0]);
  }
}
