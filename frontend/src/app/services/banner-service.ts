import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';


export interface Banner {
  id: number;
  title: string;
  redirectUrl?: string;
  orderNo: number;
  active: boolean;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  private API = `${environment.apiUrl}/banners`;


  constructor(private http: HttpClient) {}

  getAll(): Observable<Banner[]> {
    return this.http.get<Banner[]>(this.API);
  }

  create(formData: FormData): Observable<any> {
    return this.http.post(this.API, formData);
  }

  update(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.API}/${id}`, formData);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
