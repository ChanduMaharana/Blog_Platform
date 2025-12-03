import { Injectable } from '@angular/core';
// import postsData from '../../../public/assets/posts.json';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

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
  private api = `${environment.apiUrl}/posts`;

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
  return this.http.get<any[]>(`${environment.apiUrl}/comments?postId=${id}`);
}

addComment(id: number, body: any) {
  return this.http.post(`${environment.apiUrl}/comments`, { ...body, postId: id });
}


getPaginatedPosts(page: number, limit: number = 6) {
  return this.http.get<any>(`${this.api}/paginated/list?page=${page}&limit=${limit}`);
}


}
