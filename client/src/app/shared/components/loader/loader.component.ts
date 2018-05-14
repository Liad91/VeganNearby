import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'vn-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {
  @Input() size: 'small' | 'medium' | 'big' = 'big';
}
