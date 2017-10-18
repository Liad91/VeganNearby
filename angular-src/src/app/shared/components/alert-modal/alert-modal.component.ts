import { Component, Input, ViewChild } from '@angular/core';
import { MzBaseModal, MzModalComponent } from 'ng2-materialize/dist';

export interface AlertModalOptions {
  title: string,
  message?: string,
  buttons: [
    {
      text: string,
      handler?: () => void
    },
    {
      text: string,
      handler: () => void
    }
  ]
}

@Component({
  selector: 'vn-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss']
})

export class AlertModalComponent extends MzBaseModal {
  @Input() public options: AlertModalOptions;
  @ViewChild('modal')	public modal: MzModalComponent;
  private completed = false;

  public modalOptions: Materialize.ModalOptions = {
    dismissible: true,
    endingTop: '0',
    opacity: 0.5,
    complete: this.onComplete.bind(this)
  };

  public onCancel(): void {
    this.completed = true;
    this.modal.close();
    if (this.options.buttons[0].handler) {
      this.options.buttons[0].handler();
    }
  }

  public onConfirm(): void {
    this.completed = true;
    this.modal.close();
    this.options.buttons[1].handler();
  }

  private onComplete(): void {
    if (!this.completed) {
      this.onCancel();
    }
  }
}
