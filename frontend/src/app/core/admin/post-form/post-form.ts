import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../../services/category-service';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './post-form.html',
})
export class PostForm implements OnInit {

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
    this.fileSelected.emit(file);   
  }

  onContentChange(event: Event) {
  const html = (event.target as HTMLElement).innerHTML;
  this.form.get('content')?.setValue(html);
}

onPaste(event: ClipboardEvent) {
  event.preventDefault();

  const clipboardData = event.clipboardData;
  if (!clipboardData) return;

  const html = clipboardData.getData('text/html');
  const text = clipboardData.getData('text/plain');

  const clean = html
    ? this.sanitizeHtml(html)
    : this.textToHtml(text);

  document.execCommand('insertHTML', false, clean);
}

sanitizeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  doc.querySelectorAll('*').forEach(el => {
    el.removeAttribute('style');
    el.removeAttribute('class');
    el.removeAttribute('font');
  });

  return doc.body.innerHTML;
}

textToHtml(text: string): string {
  return text
    .split('\n\n')
    .map(p => `<p>${p.trim()}</p>`)
    .join('');
}

}
