import {
  Component,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, isPlatformServer, DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { PostDetail } from '../../services/post-service';
import { LucideAngularModule } from 'lucide-angular';
import { CommentSection } from '../../shared/comment-section/comment-section';

@Component({
  selector: 'app-postdetails',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, CommentSection],
  templateUrl: './postdetails.html',
})
export class Postdetails {

  post!: PostDetail;
  loading = true;

  private readonly SITE_URL = 'https://yourdomain.com';
  private readonly BASE_URL = 'https://blog-platform-backend.up.railway.app';

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.post = this.route.snapshot.data['post'];

    this.post = {
      ...this.post,
      coverImage: this.getFullUrl(this.post.coverImage),
      image: this.getFullUrl(this.post.image),
      content: this.post.content ?? ''
    };

    this.updateSEO();
    this.loading = false;
  }

  private getFullUrl(img?: string) {
    if (!img) return 'assets/default.jpg';
    if (img.startsWith('http')) return img;
    return `${this.BASE_URL}/${img.replace(/^\/+/, '')}`;
  }

  updateSEO() {
  const title: string =
    this.post.ogTitle ?? this.post.title ?? 'Blog';

  const description: string =
    this.post.metaDescription ??
    this.post.description ??
    'Read this blog post';

  const image: string =
    this.post.coverImage ??
    `${this.SITE_URL}/assets/default-og.jpg`;

  const url: string = `${this.SITE_URL}/post/${this.post.id}`;

  // Page title
  this.title.setTitle(title);

  // Meta tags (NO undefined values)
  this.meta.updateTag({ name: 'description', content: description });

  this.meta.updateTag({ property: 'og:title', content: title });
  this.meta.updateTag({ property: 'og:description', content: description });
  this.meta.updateTag({ property: 'og:image', content: image });
  this.meta.updateTag({ property: 'og:url', content: url });

  this.meta.updateTag({
    name: 'twitter:card',
    content: 'summary_large_image',
  });

  this.injectJsonLD(title, description, image, url);
}



  injectJsonLD(title: string, description: string, image: string, url: string) {
    const jsonLD = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description,
      image,
      url,
      author: {
        '@type': 'Person',
        name: this.post.author || 'Unknown'
      },
      datePublished: this.post.date
    };

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLD);
    this.document.head.appendChild(script);
  }
}
