import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { PostService, PostDetail, PostSummary } from '../../services/post-service';
import { LucideAngularModule } from 'lucide-angular';
import { CommentSection } from '../../shared/comment-section/comment-section';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-postdetails',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, CommentSection],
  templateUrl: './postdetails.html',
})
export class Postdetails implements OnInit {
  post!: PostDetail;
  loading = true;
  relatedPosts: PostSummary[] = [];

  private readonly SITE_URL = 'https://blog-platform-xybron-git-master-220101120198s-projects.vercel.app';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document,
    private postService: PostService
  ) {}

  ngOnInit() {
    const postId = this.route.snapshot.paramMap.get('id');
    
    if (postId) {
      this.loadPost(parseInt(postId));
    }
  }

  loadPost(id: number) {
    this.loading = true;
    this.postService.getById(id).subscribe({
      next: (post) => {
        this.post = {
          ...post,
          coverImage: this.postService.getFullImageUrl(post.coverImage),
          image: this.postService.getFullImageUrl(post.image),
          content: post.content || post.description || '',
          canonicalUrl: post.canonicalUrl || `${this.SITE_URL}/post/${post.id}`
        };
        
        this.updateSEO();
        this.loadRelatedPosts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading post:', error);
        this.loading = false;
      }
    });
  }

  loadRelatedPosts() {
    this.postService.list().subscribe({
      next: (posts) => {
        this.relatedPosts = posts
          .filter(p => p.id !== this.post.id && p.published)
          .slice(0, 3)
          .map(p => ({
            ...p,
            coverImage: this.postService.getFullImageUrl(p.coverImage),
            image: this.postService.getFullImageUrl(p.image)
          }));
      },
      error: (error) => {
        console.error('Error loading related posts:', error);
      }
    });
  }

  updateSEO() {
    const title = this.post.ogTitle || this.post.title || 'Blog Post';
    const description = this.post.metaDescription || this.post.description || '';
    const image = this.post.coverImage || this.post.image || '';
    const url = this.post.canonicalUrl || `${this.SITE_URL}/post/${this.post.id}`;
    const author = this.post.author || 'Unknown';
    const publishedDate = this.post.date || new Date().toISOString();

    // Update title
    this.title.setTitle(title);

    // Clear existing meta tags
    this.meta.removeTag('name="description"');
    this.meta.removeTag('property="og:title"');
    this.meta.removeTag('property="og:description"');
    this.meta.removeTag('property="og:image"');
    this.meta.removeTag('property="og:url"');
    this.meta.removeTag('name="twitter:card"');
    this.meta.removeTag('property="twitter:title"');
    this.meta.removeTag('property="twitter:description"');
    this.meta.removeTag('property="twitter:image"');
    this.meta.removeTag('property="og:type"');
    this.meta.removeTag('property="og:site_name"');

    // Add new meta tags
    this.meta.addTag({ name: 'description', content: description });
    this.meta.addTag({ property: 'og:title', content: title });
    this.meta.addTag({ property: 'og:description', content: description });
    this.meta.addTag({ property: 'og:image', content: image });
    this.meta.addTag({ property: 'og:url', content: url });
    this.meta.addTag({ property: 'og:type', content: 'article' });
    this.meta.addTag({ property: 'og:site_name', content: 'BlogPlatform' });
    
    this.meta.addTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.addTag({ name: 'twitter:title', content: title });
    this.meta.addTag({ name: 'twitter:description', content: description });
    this.meta.addTag({ name: 'twitter:image', content: image });

    // Add canonical link
    this.updateCanonicalLink(url);

    // Inject JSON-LD
    this.injectJsonLD(title, description, image, url, author, publishedDate);
  }

  updateCanonicalLink(url: string) {
    let canonicalLink = this.document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!canonicalLink) {
      canonicalLink = this.document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      this.document.head.appendChild(canonicalLink);
    }
    
    canonicalLink.setAttribute('href', url);
  }

  injectJsonLD(title: string, description: string, image: string, url: string, author: string, publishedDate: string) {
    // Remove existing JSON-LD
    const existing = document.getElementById('jsonld');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = 'jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': title,
      'description': description,
      'image': image,
      'url': url,
      'author': {
        '@type': 'Person',
        'name': author
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'BlogPlatform',
        'logo': {
          '@type': 'ImageObject',
          'url': `${this.SITE_URL}/favicon.ico`
        }
      },
      'datePublished': publishedDate,
      'dateModified': publishedDate
    });

    document.head.appendChild(script);
  }

  goHome() {
    this.router.navigateByUrl('/home');
  }

  viewPost(id?: number) {
    if (id) {
      this.router.navigate(['/post', id]);
    }
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