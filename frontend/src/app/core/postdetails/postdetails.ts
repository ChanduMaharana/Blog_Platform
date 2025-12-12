import { Component, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, isPlatformServer, isPlatformBrowser } from '@angular/common';
import { PostService, PostDetail, PostSummary } from '../../services/post-service';
import { LucideAngularModule } from 'lucide-angular';
import { firstValueFrom } from 'rxjs';
import { CommentSection } from '../../shared/comment-section/comment-section';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

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
    private meta: Meta,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getFullUrl(img: string | null | undefined): string {
    if (!img) return "assets/default.jpg";
    if (img.startsWith("http")) return img;
    return `${this.BASE_URL}/${img.replace(/^\/+/, "")}`;
  }

  private updateSEO() {
    if (!this.post) return;

    const title = this.post.ogTitle || this.post.title || "";
    const description =
      this.post.metaDescription || this.post.description || this.post.excerpt || "";
    const keywords = this.post.metaKeywords || "";
    const image = this.post.coverImage || "";
    const url = isPlatformBrowser(this.platformId)
      ? window.location.href
      : `https://your-domain.com/posts/${this.post.id}`;

    // 🔥 Works on SSR + Browser
    this.titleService.setTitle(title);

    const tags: MetaDefinition[] = [
      { name: "description", content: description },
      { name: "keywords", content: keywords },

      // Open Graph
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: image },
      { property: "og:url", content: url },
      { property: "og:type", content: "article" },

      // Twitter
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
      { name: "twitter:card", content: "summary_large_image" }
    ];

    tags.forEach(tag => this.meta.updateTag(tag));

    if (isPlatformServer(this.platformId)) {
      this.injectJSONLD(title, description, image, url);
    }
  }

  private injectJSONLD(title: string, desc: string, image: string, url: string) {
    const ld = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": title,
      "description": desc,
      "image": image,
      "author": {
        "@type": "Person",
        "name": this.post?.author || "Unknown"
      },
      "datePublished": this.post?.date,
      "url": url
    };

    this.meta.updateTag({
      id: "json-ld",
      name: "application/ld+json",
      content: JSON.stringify(ld)
    } as any);
  }

  async ngOnInit() {
    try {
      const id = Number(this.route.snapshot.paramMap.get("id"));
      const fetched = await firstValueFrom(this.postService.getById(id));

      this.post = {
        ...fetched,
        content: fetched.content ?? "",
        coverImage: this.getFullUrl(fetched.coverImage),
        image: this.getFullUrl(fetched.image)
      };

      const all = await firstValueFrom(this.postService.list());
      this.relatedPosts = all
        .filter(p => p.category === this.post?.category && p.id !== this.post?.id)
        .slice(0, 3)
        .map(p => ({
          ...p,
          coverImage: this.getFullUrl(p.coverImage),
          image: this.getFullUrl(p.image)
        }));

      this.loading = false;

      // SSR + Browser SEO
      this.updateSEO();

    } catch (error) {
      console.error("Error loading post details:", error);
      this.loading = false;
    }
  }

  viewPost(id: number) {
    this.router.navigate(["/posts", id]);
  }

  shareOnFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${location.href}`, "_blank");
  }
  shareOnTwitter() {
    window.open(`https://twitter.com/intent/tweet?url=${location.href}`, "_blank");
  }
  shareOnLinkedIn() {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${location.href}`, "_blank");
  }
  copyLink() {
    navigator.clipboard.writeText(location.href).then(() => alert("Link copied!"));
  }
}
