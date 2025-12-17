import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-management-shell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './management-shell.html',
})
export class ManagementShell {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() newLabel = 'CatNew';
  @Output() create = new EventEmitter<void>();
}
