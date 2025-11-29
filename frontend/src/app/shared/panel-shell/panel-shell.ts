import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-panel-shell',
  imports: [CommonModule],
  templateUrl: './panel-shell.html',
})
export class PanelShell {
  @Input() title = '';
}
