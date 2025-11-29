import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ad',
  imports: [CommonModule],
  templateUrl: './ad.html',
  styleUrl: './ad.css',
})
export class Ad {
  ads: Array<{ title: string; subtitle?: string; image: string; category?: string }> = [];

  constructor() {
    this.loadAds();
  }

  async loadAds() {
    try {
      const res = await fetch('/assets/ads.json'); // ensure file in src/assets/ads.json
      if (!res.ok) throw new Error('Ads load failed');
      this.ads = await res.json();
    } catch (err) {
      console.error('Failed to load ads.json', err);
      this.ads = [];
    }
  }
}
