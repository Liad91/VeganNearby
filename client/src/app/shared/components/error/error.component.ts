import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'vn-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorComponent {
  @Input() type: 'inline' | 'connection';
  @Output() retry: EventEmitter<void> = new EventEmitter();

  public onRetry(): void {
    this.retry.emit();
  }
}
