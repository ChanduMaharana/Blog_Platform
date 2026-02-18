import { Component, Input, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-free-ad',
  standalone: true,
  template: `<div class="ad-container"></div>`
})
export class FreeAd implements AfterViewInit {

  @Input() scriptUrl!: string;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const container = this.el.nativeElement.querySelector('.ad-container');

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = this.scriptUrl;
    script.async = true;

    container.appendChild(script);
  }
}
