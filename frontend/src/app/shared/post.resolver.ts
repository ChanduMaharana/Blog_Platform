import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { PostService } from '../services/post-service';

@Injectable({ providedIn: 'root' })
export class PostResolver {
  constructor(private postService: PostService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get('id')!;
    return this.postService.getById(+id);
  }
}
