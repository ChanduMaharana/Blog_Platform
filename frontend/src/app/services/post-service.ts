import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.prod';

export interface PostSummary {
  id: number;
  title: string;
  excerpt?: string;
  description?: string;
  content?: string;
  coverImage?: string;
  category?: string;
  author?: string;
  date?: string;
  image?: string;
  published?: boolean;
  featured?: boolean;
  trending?: boolean;
  views?: number;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
}

export interface PostDetail extends PostSummary {
  content: string;
  canonicalUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class PostService {
  private api = `${environment.apiUrl}/posts`;
  private readonly SITE_URL = 'https://blog-platform-xybron-git-master-220101120198s-projects.vercel.app';

  constructor(private http: HttpClient) {}

  list(): Observable<PostSummary[]> {
    return this.http.get<PostSummary[]>(this.api);
  }

  getById(id: number): Observable<PostDetail> {
    return this.http.get<PostDetail>(`${this.api}/${id}`);
  }

  create(post: PostSummary, file?: File): Observable<any> {
    const formData = new FormData();

    Object.entries(post).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    if (file) {
      formData.append("image", file, file.name);
    }

    return this.http.post(this.api, formData);
  }

  updateWithFile(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.api}/${id}`, formData);
  }

  update(id: number | undefined, post: PostSummary): Observable<any> {
    return this.http.put(`${this.api}/${id}`, post);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

  getComments(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/posts/${id}/comments`);
  }

  addComment(id: number, body: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/posts/${id}/comments`, body);
  }

  getPaginatedPosts(page: number, limit: number = 6): Observable<any> {
    return this.http.get<any>(`${this.api}/paginated/list?page=${page}&limit=${limit}`);
  }

  getFullImageUrl(img?: string): string {
    if (!img) return 'assets/default.jpg';
    if (img.startsWith('http')) return img;
    
    const backendUrl = 'https://blog-backend-biys.onrender.com/uploads/';
    if (img.includes(backendUrl)) return img;
    
    return `${backendUrl}${img.replace(/^\/+/, '')}`;
  }
}