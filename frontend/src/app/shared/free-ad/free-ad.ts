import { Component, Input, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-free-ad',
  standalone: true,
  template: `<div class="ad-container"></div>`,
})
export class FreeAdComponent implements AfterViewInit {

  @Input() adKey!: string;
  @Input() width = 728;
  @Input() height = 90;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    // @ts-ignore
    window.atOptions = {
      key: this.adKey,
      format: 'iframe',
      height: this.height,
      width: this.width,
      params: {}
    };

    const script = document.createElement('script');
    script.src = `https://www.highperformanceformat.com/${this.adKey}/invoke.js`;
    script.async = true;

    this.el.nativeElement.querySelector('.ad-container')?.appendChild(script);
  }
}
