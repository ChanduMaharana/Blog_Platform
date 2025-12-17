import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerService, Banner } from '../../services/banner-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ad',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './ad.html',
  styleUrls: ['./ad.css'],
})
export class Ad implements OnInit {
  ads: Banner[] = [];

  constructor(private bannerService: BannerService) {}

  ngOnInit() {
    this.bannerService.getAll().subscribe({
      next: (res) => {
        this.ads = res;  
      },
      error: (err) => {
        console.error('Failed to load banners', err);
      },
    });
  }
  open(url?: string) {
  if (!url) return;
  window.open(url, "_blank");
}

}
