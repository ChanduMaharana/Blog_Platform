import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostService, PostDetail, PostSummary } from '../../services/post-service';
import { LucideAngularModule } from 'lucide-angular';
import { firstValueFrom } from 'rxjs';
import { CommentSection } from '../../shared/comment-section/comment-section'; 

@Component({
  selector: 'app-postdetails',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, CommentSection],
  templateUrl: './postdetails.html',
})
export class Postdetails {
  post?: PostDetail;
  relatedPosts: PostSummary[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  async ngOnInit() {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  console.log('Route ID:', id);

  const fetched = await firstValueFrom(this.postService.getById(id));
  const all = await firstValueFrom(this.postService.list());

  console.log('Fetched Post:', fetched);

  const mappedPost: PostDetail = {
    ...fetched,
    content: fetched.content ?? "",
    coverImage: fetched.coverImage
      ? `http://localhost:3000/${fetched.coverImage}`
      : 'assets/default.jpg',
  };

  const related = all
    .filter(p => p.category === fetched.category && p.id !== fetched.id)
    .slice(0, 3)
    .map(p => ({
      ...p,
      coverImage: p.coverImage
        ? `http://localhost:3000/${p.coverImage}`
        : 'assets/default.jpg',
    }));

  this.ngZone.run(() => {
    this.post = mappedPost;
    this.relatedPosts = related;
    this.loading = false;
  });
}


  

  viewPost(id: number) {
    this.router.navigate(['/posts', id]).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
