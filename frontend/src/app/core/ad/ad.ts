import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerService, Banner } from '../../services/banner-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ad',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './ad.html',
  styleUrls: ['./ad.css'],
})
export class Ad  implements AfterViewInit {
  @Input() zoneId!: string;   
  @Input() width = 300;
  @Input() height = 250;

  ngAfterViewInit() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://www.topcreativeformat.com/${this.zoneId}/invoke.js`;
    document.body.appendChild(script);
  }
}
