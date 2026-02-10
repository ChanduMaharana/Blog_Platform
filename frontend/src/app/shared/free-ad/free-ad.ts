import { Component, Input, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-free-ad',
  standalone: true,
  template: `
    <div class="ad-container" #adHost></div>
  `,
})
export class FreeAd implements AfterViewInit {
  @Input() zoneId!: string;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const container = this.el.nativeElement.querySelector('.ad-container');

    if (!container || container.childNodes.length) return;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://www.topcreativeformat.com/${this.zoneId}/invoke.js`;

    container.appendChild(script);
  }
}
