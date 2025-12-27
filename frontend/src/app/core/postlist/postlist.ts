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
    this.route.queryParams.subscribe(params => {
      const q = params['q']?.toLowerCase();

      this.postService.list().subscribe(posts => {
        let allPosts = posts.map(post => ({
       ...post,
      slug: post.slug,
      image: post.image,
      coverImage: post.coverImage,
     category: (post as any).Category?.name
    }));



        this.posts = q
          ? allPosts.filter(p =>
              p.title?.toLowerCase().includes(q) ||
              p.description?.toLowerCase().includes(q) ||
              p.content?.toLowerCase().includes(q)
            )
          : allPosts;

        this.trendingPosts = [...this.posts]
          .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
          .slice(0, 4);

        this.popularPosts = this.posts.filter(p => (p as any).popular);

        this.totalPages = Math.ceil(this.posts.length / this.itemsPerPage);
        this.goToPage(1);
      });
    });
  }

  get paginatedPosts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.posts.slice(start, start + this.itemsPerPage);
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


  // viewPost(id: number | undefined) {
  //   if (!id) return;

  //   this.router.navigate(['/posts', id]).then(() => {
  //     this.viewportScroller.scrollToPosition([0, 0]); 
  //   });
  // }
}
