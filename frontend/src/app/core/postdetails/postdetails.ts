import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { PostDetail, PostSummary } from '../../services/post-service';
import { LucideAngularModule } from 'lucide-angular';
import { CommentSection } from '../../shared/comment-section/comment-section';
import { environment } from '../../environments/environment.prod';

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

  private readonly SITE_URL = 'https://blog-platform-xybron-git-master-220101120198s-projects.vercel.app/';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.post = this.route.snapshot.data['post'];

    this.post = {
    ...this.post,
    coverImage: this.post.coverImage,
    image: this.post.image,
    content: this.post.content ?? ''
  };
  
  this.loadRelatedPosts();
  this.updateSEO();
  this.loading = false;
  }
  loadRelatedPosts() {
  fetch(`${environment.apiUrl}/posts`)
    .then(res => res.json())
    .then(posts => {
      this.relatedPosts = posts
        .filter((p: any) => p.id !== this.post.id)
        .slice(0, 3)
        .map((p: any) => ({
          ...p,
          coverImage: p.coverImage?.startsWith('http')
            ? p.coverImage
            : 'assets/default.jpg'
        }));
    });
  }


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

    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image'
    });

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
}


  