import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'vn-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  @Input() type: 'inline' | 'connection';
  @Output() retry: EventEmitter<void> = new EventEmitter();

  public onRetry(): void {
    this.retry.emit();
  }
}
