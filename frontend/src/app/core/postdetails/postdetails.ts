import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { PostDetail, PostSummary } from '../../services/post-service';
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
  relatedPosts: PostSummary[] = [];

  private readonly SITE_URL = 'https://blog-backend-biys.onrender.com';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.post = this.route.snapshot.data['post'];
    this.updateSEO();
    this.loading = false;
  }

   private getFullUrl(img?: string): string {
    if (!img) return 'assets/default.jpg';
    if (img.startsWith('http')) return img;   
    return `${this.SITE_URL}/${img.replace(/^\/+/, '')}`;
  }

  shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  }

  shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(this.post?.title || '');
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      '_blank'
    );
  }

  shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      '_blank'
    );
  }

  copyLink() {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied!');
  }

  // viewPost(id?: number) {
  //   if (!id) return;
  //   this.router.navigate(['/post', id]);
  // }
  updateSEO() {
    const title = this.post.ogTitle || this.post.title!;
    const description = this.post.metaDescription || this.post.description!;
    const image = this.post.coverImage!;
    const url = `${this.SITE_URL}/post/${this.post.id}`;

    this.title.setTitle(title);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:url', content: url });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    this.injectJsonLD(title, description, image, url);
  }

  injectJsonLD(title: string, description: string, image: string, url: string) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description,
      image,
      url
    });
    document.head.appendChild(script);
  }

  viewPost(id?: number) {
    if (id) this.router.navigate(['/post', id]);
  }
}


  