import {
  Component, NgZone, Inject, PLATFORM_ID
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, isPlatformServer } from '@angular/common';
import { PostService, PostDetail, PostSummary } from '../../services/post-service';
import { LucideAngularModule } from 'lucide-angular';
import { firstValueFrom } from 'rxjs';
import { CommentSection } from '../../shared/comment-section/comment-section';
import {  TransferState, makeStateKey } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import {Title} from '@angular/platform-browser';

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
  private POST_KEY = makeStateKey<PostDetail>('post-data');

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private router: Router,
    private ngZone: NgZone,
    private titleService: Title,
    private meta: Meta,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getFullUrl(img: string | null | undefined): string {
    if (!img) return "assets/default.jpg";
    if (img.startsWith("http")) return img;
    return `${this.BASE_URL}/${img.replace(/^\/+/, "")}`;
  }

  /** 🔥 SEO FIX (Runs on both Server + Browser) */
  updateSEO() {
    if (!this.post) return;

    const title = this.post.ogTitle || this.post.title!;
    const desc = this.post.metaDescription || this.post.description || '';
    const keywords = this.post.metaKeywords || '';
    const ogDesc = this.post.ogDescription || desc;
    const image = this.post.coverImage || '';
    const url = typeof window !== 'undefined' ? window.location.href : '';

    this.titleService.setTitle(title);

    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ name: 'keywords', content: keywords });

    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: ogDesc });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:url', content: url });

    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: ogDesc });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.setSchemaJSONLD(title, desc, image, url);
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

    if (isPlatformServer(this.platformId)) return;

    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLD);
  }

  async ngOnInit() {
  const id = Number(this.route.snapshot.paramMap.get("id"));

  if (this.transferState.hasKey(this.POST_KEY)) {
    this.post = this.transferState.get(this.POST_KEY, null as any);
    this.transferState.remove(this.POST_KEY);
    this.updateSEO();
    this.loading = false;
    return;
  }

  const fetched = await firstValueFrom(this.postService.getById(id));

  this.post = {
    ...fetched,

    content: fetched.content ?? "",

    coverImage: this.getFullUrl(fetched.coverImage),
    image: this.getFullUrl(fetched.image),
  };

  if (isPlatformServer(this.platformId)) {
    this.transferState.set(this.POST_KEY, this.post);
  }

  this.updateSEO();
  this.loading = false;
}


}
