import { ComponentRef, Injectable, Type } from '@angular/core';
import { MzModalService, MzBaseModal,  } from 'ng2-materialize/dist';

export interface AlertModalOptions {
  title: string;
  message?: string;
  buttons: [
    {
      text: string,
      handler?: () => void
    },
    {
      text: string,
      handler: () => void
    }
  ];
}

export interface LightboxModalOptions {
  images: string[];
  active: number;
}

@Injectable()
export class ModalService {
  private modal: ComponentRef<MzBaseModal>;

  constructor(private mzModalService: MzModalService) {}

  public open(componentClass: Type<MzBaseModal>, options?: any): void {
    this.modal = this.mzModalService.open(componentClass, options);
  }

  public close(): void {
    if (this.modal) {
      this.modal.instance.modalComponent.close();
    }
  }

  public openAlert(componentClass: Type<MzBaseModal>, options: AlertModalOptions): void {
    this.modal = this.mzModalService.open(componentClass, { options });
  }

  public openLightbox(componentClass: Type<MzBaseModal>, options: LightboxModalOptions): void {
    this.modal = this.mzModalService.open(componentClass, { options });
  }
}
