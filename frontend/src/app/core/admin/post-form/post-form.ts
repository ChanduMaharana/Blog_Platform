import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CategoryService, Category } from '../../../services/category-service';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-form.html',
})
export class PostForm implements OnInit {
  @Input() form!: FormGroup;
  @Input() editMode = false;
  @Output() submitForm = new EventEmitter<void>();
  @Output() cancelForm = new EventEmitter<void>();

  categories: Category[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.categoryService.getAll().subscribe(res => {
      this.categories = res.filter(c => c.active);
    });
  }

  onSubmit() { this.submitForm.emit(); }
  onCancel() { this.cancelForm.emit(); }

  onFile(event: any) {
    const file = event.target.files?.[0];
    this.form.patchValue({ image: file ? file.name : '' });
  }
}
