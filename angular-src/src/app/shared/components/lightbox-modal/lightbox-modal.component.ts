import { Component, Input } from '@angular/core';
import { MzBaseModal } from 'ng2-materialize/dist';

import { imageStateTrigger } from './animations';
import { ModalService, LightboxModalOptions } from '../../../core/services/modal.service';

@Component({
  selector: 'vn-lightbox-modal',
  templateUrl: './lightbox-modal.component.html',
  styleUrls: ['./lightbox-modal.component.scss'],
  animations: [imageStateTrigger]
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
    if (this.options.active + 1 !== this.options.images.length) {
      this.options.active++;
    }
    else {
      this.options.active = 0;
    }
  }

  public prev(): void {
    if (this.options.active - 1 > -1) {
      this.options.active--;
    }
    else {
      this.options.active = this.options.images.length - 1;
    }
  }
}
