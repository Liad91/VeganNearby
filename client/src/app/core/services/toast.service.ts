import { Injectable } from '@angular/core';
import { MzToastService } from 'ng2-materialize';

@Injectable()
export class ToastService {
  private isShowing = false;
  private messages: string[] = [];

  constructor(private mzToastService: MzToastService) { }

  public show(message: string) {
    this.messages.push(message);

    if (!this.isShowing) {
      this.next();
    }
  }

  private next() {
    this.isShowing = true;
    const message = this.messages.shift();

    this.mzToastService.show(message, 3000, '', () => {
      if (this.messages.length > 0) {
        this.next();
      }
      else {
        this.isShowing = false;
      }
    });
  }
}
