import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MzBaseModal } from 'ng2-materialize';

import { LightboxModalOptions, ModalService } from '../../../services/modal.service';

@Component({
  selector: 'vn-lightbox-modal',
  templateUrl: './lightbox-modal.component.html',
  styleUrls: ['./lightbox-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LightboxModalComponent extends MzBaseModal {
  @Input() public options: LightboxModalOptions;

  constructor(private modalService: ModalService) {
    super();
  }

  public modalOptions: Materialize.ModalOptions = {
    dismissible: true,
    opacity: 0.8
  };

  public onClose(): void {
    this.modalService.close();
  }

  public next(): void {
    this.options.active = this.options.active + 1 !== this.options.images.length ? this.options.active + 1 : 0;
  }

  public prev(): void {
    this.options.active = this.options.active - 1 > -1 ? this.options.active - 1 : this.options.images.length - 1;
  }
}
