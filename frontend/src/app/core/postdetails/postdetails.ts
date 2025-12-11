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

  private readonly BASE_URL = "https://blog-platform-backend.up.railway.app";

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  private getFullUrl(img: string | null | undefined): string {
    if (!img) return "assets/default.jpg";        // fallback image
    if (img.startsWith("http")) return img;       // already a full URL
    const cleaned = img.replace(/^\/+/, "");      // remove leading slashes
    return `${this.BASE_URL}/${cleaned}`;         // prepend backend URL
  }

  async ngOnInit() {
    try {
      const id = Number(this.route.snapshot.paramMap.get("id"));
      console.log("Route ID:", id);

      // Fetch the post
      const fetched = await firstValueFrom(this.postService.getById(id));
      console.log("Fetched Post:", fetched);

      // Map post images
      const mappedPost: PostDetail = {
        ...fetched,
        content: fetched.content ?? "",
        coverImage: this.getFullUrl(fetched.coverImage),
        image: this.getFullUrl(fetched.image),
      };

      // Fetch all posts to get related ones
      const allPosts = await firstValueFrom(this.postService.list());
      const related = allPosts
        .filter(p => p.category === fetched.category && p.id !== fetched.id)
        .slice(0, 3)
        .map(p => ({
          ...p,
          coverImage: this.getFullUrl(p.coverImage),
          image: this.getFullUrl(p.image),
        }));

      this.ngZone.run(() => {
        this.post = mappedPost;
        this.relatedPosts = related;
        this.loading = false;
      });

    } catch (error) {
      console.error("Error loading post details:", error);
      this.loading = false;
    }
  }

  viewPost(id: number) {
    this.router.navigate(['/posts', id]).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  shareOnFacebook() {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(this.post?.title || '');
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`, '_blank');
}

shareOnTwitter() {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(this.post?.title || '');
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
}

shareOnLinkedIn() {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(this.post?.title || '');
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
}

copyLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    alert("Link copied to clipboard!");
  });
}

}
