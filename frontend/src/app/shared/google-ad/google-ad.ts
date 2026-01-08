import { Component, AfterViewInit, Input } from '@angular/core';
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
@Component({
  selector: 'app-google-ad',
  imports: [],
  templateUrl: './google-ad.html',
})
export class GoogleAd implements AfterViewInit {
   @Input() adClient = 'ca-pub-9862624119814614'; 
  @Input() adSlot!: string;                 

  ngAfterViewInit(): void {
     setTimeout(() => {
      try {
        if (window.adsbygoogle) {
          window.adsbygoogle.push({});
        }
      } catch (err) {
        console.warn('Adsense not loaded yet');
      }
    }, 500);
  }
}
