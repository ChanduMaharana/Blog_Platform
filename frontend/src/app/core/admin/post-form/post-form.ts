import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-form.html',
})
export class PostForm {
  @Input() form!: FormGroup;
  @Input() editMode = false;
  @Output() submitForm = new EventEmitter<void>();
  @Output() cancelForm = new EventEmitter<void>();

  categories = ['News', 'Business', 'Politics', 'Tech', 'Sports'];

  onSubmit() { this.submitForm.emit(); }
  onCancel() { this.cancelForm.emit(); }

  onFile(event: any) { 
    const file = event.target.files?.[0];
    // for now store filename. If you want upload, implement FormData + multer backend.
    this.form.patchValue({ image: file ? file.name : '' });
  }
}
