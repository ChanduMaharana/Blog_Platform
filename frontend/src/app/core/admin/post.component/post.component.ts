import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PostService, PostSummary } from '../../../services/post-service';
import { PostForm } from '../post-form/post-form';
import { ManagementShell } from '../../../shared/management-shell/management-shell';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,ManagementShell, PostForm],
  templateUrl: './post.component.html',
})
export class PostComponent {
  form: FormGroup;
  posts: PostSummary[] = [];
  showForm = false;
  editMode = false;

  categories = ['News', 'Business', 'Politics', 'Tech', 'Sports'];

  constructor(private fb: FormBuilder, private postService: PostService) {
    this.form = this.fb.group({
      id: [0],
      title: [''],
      excerpt: [''],
      description: [''],
      content: [''],
      category: [''],
      author: [''],
      date: [''],
      image: [''],
      published: [false],
      featured: [false],
      trending: [false],
      views: [0],
      metaDescription: [''],
      metaKeywords: [''],
      ogTitle: [''],
      ogDescription: ['']
    });
  }

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.list().subscribe({
      next: (res) => {
        this.posts = res.map(p => ({
          ...p,
          published: p.published ?? false,
          featured: p.featured ?? false,
          trending: p.trending ?? false,
          views: p.views ?? 0,
        }));
      },
      error: (err) => console.error('Failed to load posts', err)
    });
  }

  toggleCreate() {
    this.showForm = true;
    this.editMode = false;
    this.form.reset({
      id: 0,
      title: '',
      excerpt: '',
      description: '',
      content: '',
      category: '',
      author: '',
      date: new Date().toDateString(),
      image: '',
      published: false,
      featured: false,
      trending: false,
      views: 0,
      metaDescription: '',
      metaKeywords: '',
      ogTitle: '',
      ogDescription: ''
    });
  }

  editPost(post: PostSummary) {
    this.showForm = true;
    this.editMode = true;
    this.form.patchValue(post);
  }

  viewPost(post: PostSummary) {
    alert(`Viewing post:\n\n${post.title}\n\n${post.description ?? ''}`);
  }

  cancel() {
    this.showForm = false;
    this.editMode = false;
  }

  onSubmit() {
    const payload = this.form.value as PostSummary;

    // Ensure required fields exist to avoid backend notNull errors
    payload.description = payload.description || payload.excerpt || '';
    payload.date = payload.date || new Date().toDateString();
    payload.author = payload.author || 'Unknown';

    if (this.editMode) {
      this.postService.update(payload.id, payload).subscribe({
        next: () => { this.loadPosts(); this.cancel(); },
        error: err => console.error('Update failed', err)
      });
    } else {
      this.postService.create(payload).subscribe({
        next: () => { this.loadPosts(); this.cancel(); },
        error: err => console.error('Create failed', err)
      });
    }
  }

  deletePost(id?: number) {
    if (!id) return;
    if (confirm('Delete this post?')) {
      this.postService.delete(id).subscribe({
        next: () => this.loadPosts(),
        error: err => console.error('Delete failed', err)
      });
    }
  }
}
