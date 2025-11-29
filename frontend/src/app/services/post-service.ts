import { Injectable } from '@angular/core';
// import postsData from '../../../public/assets/posts.json';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PostSummary {
  id: number;
  title: string;
  excerpt?: string;
  description?: string;
  content?: string;
  coverImage?:string;
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
  
}

export interface PostDetail extends PostSummary {
 content: string; 
}

@Injectable({ providedIn: 'root' })
export class PostService {
  private api = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient) {}

  list(): Observable<PostSummary[]> {
    return this.http.get<PostSummary[]>(this.api);
  }

  getById(id: number) {
    return this.http.get<PostSummary>(`${this.api}/${id}`);
  }

  create(post: PostSummary): Observable<any> {
  post.date = post.date || new Date().toISOString();
  post.description = post.description || post.excerpt || 'No description';
  post.author = post.author || 'Admin';

  return this.http.post(this.api, post);
}

  update(id: number | undefined, post: PostSummary) {
    return this.http.put(`${this.api}/${id}`, post);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }

getComments(id: number) {
  return this.http.get<any[]>(`http://localhost:3000/api/posts/${id}/comments`);
}

addComment(id: number, body: any) {
  return this.http.post(`http://localhost:3000/api/posts/${id}/comments`, body);
}

getPaginatedPosts(page: number, limit: number = 6) {
  return this.http.get<any>(`http://localhost:3000/api/posts/paginated/list?page=${page}&limit=${limit}`);
}


}
