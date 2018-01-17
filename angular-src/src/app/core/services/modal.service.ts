import { ComponentRef, Injectable, Type } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MzModalService, MzBaseModal,  } from 'ng2-materialize/dist';
import { map, mapTo, filter, tap } from 'rxjs/operators';

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

  constructor(private mzModalService: MzModalService, private router: Router) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => this.close());
  }

  public open(componentClass: Type<MzBaseModal>, options?: any): void {
    this.modal = this.mzModalService.open(componentClass, options);
  }

  public openAlert(componentClass: Type<MzBaseModal>, options: AlertModalOptions): void {
    this.modal = this.mzModalService.open(componentClass, { options });
  }

  public openLightbox(componentClass: Type<MzBaseModal>, options: LightboxModalOptions): void {
    this.modal = this.mzModalService.open(componentClass, { options });
  }

  public openAuth(componentClass: Type<MzBaseModal>, mode: 'login' | 'register'): void {
    this.modal = this.mzModalService.open(componentClass, { mode });
  }

  public close(): void {
    if (this.modal) {
      this.modal.instance.modalComponent.close();
      this.modal = null;
    }
  }
}
