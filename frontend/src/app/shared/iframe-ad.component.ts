import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-iframe-ad',
  standalone: true,
  template: `
    <iframe
      [src]="safeSrc"
      [width]="width"
      [height]="height"
      frameborder="0"
      scrolling="no"
      style="border:0; overflow:hidden;"
    ></iframe>
  `
})
export class IframeAdComponent {
  @Input() width = 728;
  @Input() height = 90;

  safeSrc!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}

  @Input() set src(value: string) {
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }
}
