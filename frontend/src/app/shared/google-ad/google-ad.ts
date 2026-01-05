import { Component, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'app-google-ad',
  imports: [],
  templateUrl: './google-ad.html',
})
export class GoogleAd implements AfterViewInit {
   @Input() adClient = 'ca-pub-9862624119814614'; 
  @Input() adSlot!: string;                 

  ngAfterViewInit(): void {
    try {
      // @ts-ignore
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('Adsense error', e);
    }
  }
}
