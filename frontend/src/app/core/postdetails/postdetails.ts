import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostService, PostDetail, PostSummary } from '../../services/post-service';
import { LucideAngularModule } from 'lucide-angular';
import { firstValueFrom } from 'rxjs';
import { CommentSection } from '../../shared/comment-section/comment-section';
import { Title, Meta } from '@angular/platform-browser';

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
    private ngZone: NgZone,
    private titleService: Title,
    private meta: Meta
  ) {}


  private getFullUrl(img: string | null | undefined): string {
    if (!img) return "assets/default.jpg";
    if (img.startsWith("http")) return img;
    const cleaned = img.replace(/^\/+/, "");
    return `${this.BASE_URL}/${cleaned}`;
  }

  updateSEO() {
  if (!this.post) return;

  const title = this.post.ogTitle || this.post.title || '';
  const description =
    this.post.metaDescription || this.post.description || this.post.excerpt || '';
  const keywords = this.post.metaKeywords || '';
  const ogDesc = this.post.ogDescription || description;
  const image = this.post.coverImage || '';
  const url = window.location.href || '';

  this.titleService.setTitle(title);

  this.meta.updateTag({ name: 'description', content: description });
  this.meta.updateTag({ name: 'keywords', content: keywords });

  this.meta.updateTag({ property: 'og:title', content: title });
  this.meta.updateTag({ property: 'og:description', content: ogDesc });
  this.meta.updateTag({ property: 'og:image', content: image });
  this.meta.updateTag({ property: 'og:url', content: url });

  this.meta.updateTag({ name: 'twitter:title', content: title });
  this.meta.updateTag({ name: 'twitter:description', content: ogDesc });
  this.meta.updateTag({ name: 'twitter:image', content: image });

  this.setSchemaJSONLD(title, description, image, url);
}

  setSchemaJSONLD(title: string, description: string, image: string, url: string) {
    const jsonLD = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": title,
      "description": description,
      "image": image,
      "author": {
        "@type": "Person",
        "name": this.post?.author || "Unknown"
      },
      "datePublished": this.post?.date,
      "url": url
    };

    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLD);
  }

  async ngOnInit() {
    try {
      const id = Number(this.route.snapshot.paramMap.get("id"));

      const fetched = await firstValueFrom(this.postService.getById(id));

      const mappedPost: PostDetail = {
        ...fetched,
        content: fetched.content ?? "",
        coverImage: this.getFullUrl(fetched.coverImage),
        image: this.getFullUrl(fetched.image),
      };

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

        this.updateSEO();
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
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  }

  copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert("Link copied to clipboard!");
    });
  }
}
