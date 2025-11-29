import { Component, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post-service';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment-section.html',
})
export class CommentSection {

  comments: any[] = [];

  commentForm = {
    name: '',
    email: '',
    comment: ''
  };

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private ngZone: NgZone
  ) {}

  async ngOnInit() {
    const postId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadComments(postId);
  }

  async loadComments(id: number) {
    const res = await firstValueFrom(this.postService.getComments(id));
    this.comments = Array.isArray(res) ? res : [];
  }

  async submitComment() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.commentForm.name || !this.commentForm.email || !this.commentForm.comment) {
      alert("Please fill all fields");
      return;
    }

    await firstValueFrom(this.postService.addComment(id, this.commentForm));

    this.commentForm = { name: '', email: '', comment: '' };

    this.loadComments(id);
  }
}
