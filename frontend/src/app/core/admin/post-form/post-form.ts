import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../../services/category-service';
import { environment } from '../../../environments/environment';

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

  format(command: 'bold' | 'italic' | 'underline') {
  document.execCommand(command, false);
  this.syncContent();
}

  insertLink() {
  const url = prompt('Enter URL');
  if (!url) return;

  document.execCommand('createLink', false, url);
  this.syncContent();
}

insertImage() {
  const url = prompt('Enter Image URL');
  if (!url) return;

  document.execCommand('insertImage', false, url);
  this.syncContent();
}

syncContent() {
  const editor = document.querySelector('[contenteditable="true"]') as HTMLElement;
  if (editor) {
    this.form.get('content')?.setValue(editor.innerHTML);
  }
}

  onSubmit() {
  if (!this.form.get('categoryId')?.value) {
    alert('Please select a category');
    return;
  }
  this.submitForm.emit();
 }
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

triggerImageUpload() {
  const input = document.getElementById('editorImageInput') as HTMLInputElement;
  input?.click();
}

// onEditorImageSelected(event: Event) {
//   const input = event.target as HTMLInputElement;
//   if (!input.files || !input.files.length) return;

//   const file = input.files[0];

//   this.fileSelected.emit(file);

//   const reader = new FileReader();
//   reader.onload = () => {
//     document.execCommand('insertImage', false, reader.result as string);
//     this.syncContent();
//   };
//   reader.readAsDataURL(file);

//   input.value = '';
// }

onEditorImageSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];

  const formData = new FormData();
  formData.append('image', file);

 fetch(`${environment.apiUrl}/posts/upload-image`, {
  method: 'POST',
  body: formData
})
.then(async res => {
  const text = await res.text();
  console.log("UPLOAD RESPONSE:", text);
  return JSON.parse(text);
})
.then(data => {
  const imageUrl = data.url;
  document.execCommand('insertImage', false, imageUrl);
  this.syncContent();
})
.catch(err => {
  console.error("UPLOAD FAILED:", err);
});

}


}
