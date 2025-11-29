import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Slice } from 'lucide-angular';

@Component({
  selector: 'app-list-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-card.html',
})
export class ListCard<T extends { id: number }> {
  @Input() items: T[] = [];
  @Input() titleKey: keyof T = 'title' as keyof T;
  @Input() subtitleKey?: keyof T;
  @Input() activeKey?: keyof T;
  @Input() orderKey?: keyof T;

  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<number>();

  trackById(i: number, item: T) {
    return item.id;
  }

  onEdit(item: T) {
    this.edit.emit(item);
  }

  getTitlePrefix(item: T): string {
    const value = item?.[this.titleKey];
    if (value === null || value === undefined) return 'NA';
    return value.toString().slice(0, 2);
  }

  getAvatarClass(item: T): string {
    // Different colors based on item type or status
    const colors = [
      'bg-blue-100 text-blue-700',
      'bg-green-100 text-green-700', 
      'bg-purple-100 text-purple-700',
      'bg-orange-100 text-orange-700',
      'bg-red-100 text-red-700',
      'bg-indigo-100 text-indigo-700'
    ];
    const index = item.id % colors.length;
    return colors[index];
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }
}