import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-free-ad',
  standalone: true,
 template: `
  <a 
    [href]="link" 
    target="_blank" 
    rel="noopener noreferrer"
    class="block w-full"
  >
    <div class="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition bg-white border border-gray-200">

      <img 
        src="https://picsum.photos/400/250" 
        class="w-full h-48 object-cover"
      />

      <div class="p-4">
        <div class="text-xs text-gray-400 mb-1">Advertisement</div>

        <h3 class="font-semibold text-gray-800 text-sm">
          🔥 You Won’t Believe This Offer!
        </h3>

        <p class="text-gray-500 text-xs mt-1">
          Click to discover exclusive content.
        </p>
      </div>

    </div>
  </a>
`})
export class FreeAd {

  @Input() link!: string;
}