import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-management-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './management-form.html',
})
export class ManagementFormComponent {
  @Input() form!: FormGroup;
  @Input() visible = false;
  @Input() title = '';
  @Input() submitLabel = 'Save';
  @Output() submit = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
