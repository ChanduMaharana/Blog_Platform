import { Component, Input } from '@angular/core';

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
      <div class="bg-gray-100 
                  min-h-[500px] 
                  flex flex-col 
                  items-center 
                  justify-center 
                  rounded-xl 
                  border 
                  shadow 
                  hover:shadow-lg 
                  transition">

        <div class="text-xs text-gray-400 mb-3">
          Advertisement
        </div>

        <div class="text-2xl font-bold text-gray-700">
          🔥 Sponsored Content
        </div>

        <div class="mt-4 text-gray-500 text-sm">
          Click to discover more
        </div>

      </div>
    </a>
  `
})
export class FreeAd {
  @Input() link!: string;
}