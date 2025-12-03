import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ManagementShell } from '../../../shared/management-shell/management-shell';
import { ListCard } from "../../../layout/list-card/list-card";
import { BannerService } from '../../../services/banner-service';

type Banner = {
  id: number;
  title: string;
  redirectUrl?: string;
  orderNo: number;
  active: boolean;
  image: string; 
};

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ManagementShell, ListCard],
  templateUrl: './banner.component.html',
})
export class BannerComponent {
  form: FormGroup;
  showForm = false;
  editMode = false;
  previewName: string | null = null;

  banners: Banner[] = [];

  constructor(private fb: FormBuilder, private bannerService: BannerService) {
    this.form = this.fb.group({
      id: [0],
      title: [''],
      redirectUrl: [''],
      orderNo: [0],
      active: [true],
      imageFile: [null]
    });
  }

  ngOnInit() {
    this.loadBanners();
  }

  // Load from backend and map to Banner type
  loadBanners() {
    this.bannerService.getAll().subscribe({
      next: (res) => {
        this.banners = res.map(b => ({
          id: b.id,
          title: b.title,
          redirectUrl: b.redirectUrl,
          orderNo: b.orderNo,
          active: b.active,
          image: b.image, // full URL from backend
        }));
      },
      error: (err) => console.error(err),
    });
  }

  toggleCreate() {
    this.showForm = !this.showForm;
    if (!this.showForm) this.cancel();
  }

  onFileChange(event: any) {
    const file: File = event.target.files?.[0];

    if (!file) {
      this.form.patchValue({ imageFile: null });
      this.previewName = null;
      return;
    }

    this.form.patchValue({ imageFile: file });
    this.previewName = file.name;
  }

  startEdit(b: Banner) {
    this.editMode = true;
    this.showForm = true;
    this.previewName = b.image;

    this.form.patchValue({
      id: b.id,
      title: b.title,
      redirectUrl: b.redirectUrl || '',
      orderNo: b.orderNo,
      active: b.active,
      imageFile: null
    });
  }

onSubmit() {
  const v = this.form.value;

  const formData = new FormData();
  formData.append("title", v.title);
  formData.append("redirectUrl", v.redirectUrl);
  formData.append("orderNo", v.orderNo);
  formData.append("active", v.active);

  if (v.imageFile) {
    formData.append("image", v.imageFile);
  }

  if (this.editMode) {
    this.bannerService.update(v.id, formData).subscribe(() => {
      this.loadBanners();
      this.cancel();
    });
  } else {
    this.bannerService.create(formData).subscribe(() => {
      this.loadBanners();
      this.cancel();
    });
  }
}


  cancel() {
    this.editMode = false;
    this.showForm = false;
    this.previewName = null;

    this.form.reset({
      id: 0,
      title: '',
      redirectUrl: '',
      orderNo: 0,
      active: true,
      imageFile: null
    });
  }

deleteBanner(id: number) {
  if (!confirm("Delete this banner?")) return;

  this.bannerService.delete(id).subscribe(() => {
    this.loadBanners();
  });
}


  trackById(i: number, item: Banner) {
    return item.id;
  }
}
