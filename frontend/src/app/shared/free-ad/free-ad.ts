import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-free-ad',
  standalone: true,
  template: `
    <a 
      [href]="link" 
      target="_blank" 
      rel="noopener noreferrer"
      class="ad-box block text-center cursor-pointer"
    >
      <div class="text-gray-500 text-sm mb-2">Advertisement</div>

      <div class="bg-gray-100 h-[250px] flex items-center justify-center rounded-lg border-2 border-dashed border-gray-400 hover:bg-gray-200 transition">
        <span class="text-gray-700 font-semibold">
          🔥 Sponsored Content
        </span>
      </div>
    </a>
  `
})
export class FreeAd {

  @Input() link!: string;
}