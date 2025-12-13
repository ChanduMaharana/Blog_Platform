import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PostService } from '../services/post-service';

export const postResolver: ResolveFn<any> = (route) => {
  const postService = inject(PostService);
  const id = Number(route.paramMap.get('id'));
  return postService.getById(id);
};
