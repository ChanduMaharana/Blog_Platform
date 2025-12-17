import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ListCard } from "../../../layout/list-card/list-card";
import { ManagementShell } from "../../../shared/management-shell/management-shell";
import { CategoryService, Category } from '../../../services/category-service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule, ListCard, ManagementShell],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
  form!: FormGroup;
  showForm = false;
  editMode = false;

  categories: Category[] = [];

  constructor(private fb: FormBuilder, private categoryService: CategoryService) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [0],
      name: [''],
      orderNo: [0],
      active: [true]
    });

    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe(res => {
      this.categories = res;
    });
  }

  toggleCreate() {
    this.showForm = !this.showForm;
    if (!this.showForm) this.cancel();
  }

  startEdit(c: Category) {
    this.editMode = true;
    this.showForm = true;
    this.form.patchValue(c);
  }

  onSubmit() {
    const v = this.form.value;

    if (this.editMode) {
      this.categoryService.update(v.id, v).subscribe(() => {
        this.loadCategories();
        this.cancel();
      });
    } else {
      this.categoryService.create(v).subscribe(() => {
        this.loadCategories();
        this.cancel();
      });
    }
  }

  cancel() {
    this.editMode = false;
    this.showForm = false;
    this.form.reset({ id: 0, name: '', orderNo: 0, active: true });
  }

  deleteCategory(id: number) {
    if (!confirm('Delete this category?')) return;

    this.categoryService.delete(id).subscribe(() => {
      this.loadCategories();
    });
  }

  trackById(i: number, item: Category) {
    return item.id;
  }
}
