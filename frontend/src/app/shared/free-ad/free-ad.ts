import { Component ,Input, AfterViewInit} from '@angular/core';

@Component({
  selector: 'app-free-ad',
  imports: [],
  templateUrl: './free-ad.html',
})
export class FreeAd {

  @Input() zoneId!: string;   // ad network zone id
  @Input() width = 300;
  @Input() height = 250;

  ngAfterViewInit() {
    // Adsterra / Propeller style script injection
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://www.topcreativeformat.com/${this.zoneId}/invoke.js`;
    document.body.appendChild(script);
  }

}
