import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, ResolveFn } from '@angular/router';
import { PostDetail, PostService } from '../services/post-service';

@Injectable({ providedIn: 'root' })
export class PostResolver implements Resolve<PostDetail> {
  constructor(private postService: PostService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.postService.getById(Number(route.paramMap.get('id')));
  }
}
