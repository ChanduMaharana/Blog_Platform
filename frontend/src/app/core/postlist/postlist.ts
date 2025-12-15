import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostService, PostSummary } from '../../services/post-service';
import { firstValueFrom } from 'rxjs';
import { PaginationComponent } from '../../shared/pagination/pagination';
import { environment } from '../../environments/environment.prod';
@Component({
  selector: 'app-postlist',
  standalone: true,
  imports: [CommonModule,PaginationComponent],
  templateUrl: './postlist.html',
  styleUrl: './postlist.css',
})
export class Postlist {
  posts: PostSummary[] = [];
  trendingPosts: PostSummary[] = [];
  popularPosts: PostSummary[] = [];

  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 0;

  constructor(private postService: PostService, private router: Router) {}

async ngOnInit() {
  this.postService.list().subscribe(posts => {
    console.log('Posts from API:', posts);

    this.posts = posts.map(post => ({
  ...post,
  coverImage: post.coverImage,
  category: (post as any).category || 'News',
}));


    this.trendingPosts = [...this.posts]
      .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
      .slice(0, 4);

    this.popularPosts = this.posts.filter(p => (p as any).popular);

    this.totalPages = Math.ceil(this.posts.length / this.itemsPerPage);

    this.goToPage(1);
  });
}


  get paginatedPosts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.posts.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

 viewPost(id: number | undefined) {
  if (!id) return; 

  this.router.navigate(['/posts', id]).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

}
