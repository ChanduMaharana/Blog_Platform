import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-post-card',
  imports: [CommonModule],
  templateUrl: './post-card.html',
})
export class PostCard {
@Input() posts: any[] = [];
  @Output() open = new EventEmitter<string>();

  trackById(_: number, post: any) {
    return post.id;
  }

  openPost(slug: string) {
    this.open.emit(slug);
  }
}
