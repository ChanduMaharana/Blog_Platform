import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-iframe-ad',
  standalone: true,
  template: `
    <div class="iframe-ad-wrapper">
      <iframe
        [src]="src"
        [width]="width"
        [height]="height"
        frameborder="0"
        scrolling="no"
        allowfullscreen
        sandbox="allow-scripts allow-same-origin">
      </iframe>
    </div>
  `,
  styles: [`
    .iframe-ad-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
      overflow: hidden;
      margin: 20px 0;
    }

    iframe {
      border: 0;
      max-width: 100%;
    }
  `]
})
export class IframeAdComponent {
  @Input() src!: string;
  @Input() width = 728;
  @Input() height = 90;
}
