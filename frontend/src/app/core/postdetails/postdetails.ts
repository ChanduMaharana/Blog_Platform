import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { PostService, PostDetail, PostSummary } from '../../services/post-service';
import { CommentSection } from '../../shared/comment-section/comment-section';
import { environment } from '../../environments/environment';
import { SafeHtmlPipe } from "../../shared/safe-html.pipe";
import { GoogleAd } from "../../shared/google-ad/google-ad";

@Component({
  selector: 'app-postdetails',
  standalone: true,
  imports: [CommonModule, CommentSection, RouterModule, SafeHtmlPipe, GoogleAd],
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
  this.route.paramMap.subscribe(params => {
    const slug = params.get('slug');
    if (slug) {
      this.loading = true;
      this.postService.getBySlug(slug).subscribe(post => {
        this.post = {
          ...post,
          coverImage: this.postService.getFullImageUrl(post.coverImage),
          image: this.postService.getFullImageUrl(post.image),
          content: post.content || '',
          canonicalUrl: `${this.SITE_URL}/post/${post.slug}`
        };
        this.updateSEO();
        this.loadRelatedPosts();
        this.loading = false;
      });
    }
  });
}


 goBack() {
  this.router.navigate(['/home']);
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
        .filter(p => p.id !== this.post.id)
        .slice(0, 3)
        .map(p => ({
          ...p,
          image: this.postService.getFullImageUrl(
            p.image || p.coverImage
          )
        }));
    },
    error: (error) => {
      console.error('Error loading related posts:', error);
    }
  });
}


updateSEO() {
  const title: string =
    this.post.ogTitle ?? this.post.title ?? 'Blog Platform';

  const description: string =
    this.post.metaDescription ??
    this.post.description ??
    'Read this blog post';

  const image: string =
    this.post.coverImage ??
    'https://blog-backend-biys.onrender.com/uploads/default-og.jpg';

  const url: string = `${this.SITE_URL}/post/${this.post.slug}`;

this.updateCanonicalLink(url);
  this.title.setTitle(title);

  this.meta.updateTag({ name: 'description', content: description });
  this.meta.updateTag({ property: 'og:title', content: title });
  this.meta.updateTag({ property: 'og:description', content: description });
  this.meta.updateTag({ property: 'og:image', content: image });
  this.meta.updateTag({ property: 'og:type', content: 'article' });
  this.meta.updateTag({ property: 'og:url', content: url });

  this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
  this.meta.updateTag({ name: 'twitter:image', content: image });
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


 viewPost(slug?: string) {
  if (!slug) return;
  this.router.navigate(['/post', slug]);
}


private getShareUrl(): string {
return `https://thexybron.com/post/${this.post.slug}`;
}


  shareOnFacebook() {
  const url = encodeURIComponent(this.getShareUrl());
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    '_blank'
  );
}


  shareOnTwitter() {
  const url = encodeURIComponent(this.getShareUrl());
  const text = encodeURIComponent(this.post?.title || '');
  window.open(
    `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    '_blank'
  );
}

shareOnLinkedIn() {
  const url = encodeURIComponent(this.getShareUrl());
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    '_blank'
  );
}
 shareOnWhatsApp() {
  const url = encodeURIComponent(this.getShareUrl());
  const text = encodeURIComponent(this.post?.title || '');
  window.open(
    `https://api.whatsapp.com/send?text=${text}%20${url}`,
    '_blank'
  );
}

copyLink() {
  navigator.clipboard.writeText(this.getShareUrl());
  alert('Share link copied!');
}

}