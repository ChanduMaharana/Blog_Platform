import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../../services/category-service';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule,FormsModule,CKEditorModule, ReactiveFormsModule],
  templateUrl: './post-form.html',
})
export class PostForm implements OnInit {
   public Editor: any = ClassicEditor;

  @Input() form!: FormGroup;
  @Input() editMode = false;

  @Output() submitForm = new EventEmitter<void>();
  @Output() cancelForm = new EventEmitter<void>();
  @Output() fileSelected = new EventEmitter<File | null>();   

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
    const file = event.target.files?.[0] || null;
    this.fileSelected.emit(file);     // <-- Correct usage
  }
}
