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
  ngAfterViewInit() {
  setTimeout(() => {
    const script1 = document.createElement('script');
    script1.type = 'text/javascript';
    script1.innerHTML = `
      var atOptions = {
        'key' : 'a88dfd6feba69be6dc45f290686fbebe',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;

    const script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.src = 'https://www.highperformanceformat.com/a88dfd6feba69be6dc45f290686fbebe/invoke.js';
    script2.async = true;

    this.el.nativeElement.appendChild(script1);
    this.el.nativeElement.appendChild(script2);
  }, 500);
}

}
