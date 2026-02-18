import { Component, Input, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-free-ad',
  standalone: true,
  template: `<div class="ad-container"></div>`
})
export class FreeAd implements AfterViewInit {

  @Input() adKey!: string;
  @Input() width = 728;
  @Input() height = 90;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const container = this.el.nativeElement.querySelector('.ad-container');

    // Create atOptions script
    const optionsScript = document.createElement('script');
    optionsScript.type = 'text/javascript';
    optionsScript.innerHTML = `
      var atOptions = {
        'key' : '${this.adKey}',
        'format' : 'iframe',
        'height' : ${this.height},
        'width' : ${this.width},
        'params' : {}
      };
    `;

    container.appendChild(optionsScript);

    // Create invoke script
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = `https://www.highperformanceformat.com/${this.adKey}/invoke.js`;
    invokeScript.async = true;

    container.appendChild(invokeScript);
  }
}
