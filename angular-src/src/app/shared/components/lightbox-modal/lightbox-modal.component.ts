import { Component, Input } from '@angular/core';
import { MzBaseModal } from 'ng2-materialize/dist';

import { imageStateTrigger } from './animations';

export interface LightboxModalOptions {
  images: string[];
  active: number;
}

@Component({
  selector: 'vn-lightbox-modal',
  templateUrl: './lightbox-modal.component.html',
  styleUrls: ['./lightbox-modal.component.scss'],
  animations: [imageStateTrigger]
})

export class LightboxModalComponent extends MzBaseModal {
  @Input() public options: LightboxModalOptions;

  public modalOptions: Materialize.ModalOptions = {
    dismissible: true,
    endingTop: '0',
    opacity: 0.8
  };

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
