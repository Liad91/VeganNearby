import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class ResizeService {
  public screenSize = new BehaviorSubject<string>(this.getScreenSize());

  constructor() {
    Observable.fromEvent(window, 'resize')
      .map(this.getScreenSize)
      .subscribe(this.screenSize);
  }

  private getScreenSize(): string {
    switch (true) {
      case window.innerWidth < 600:
        return 'xs';
      case window.innerWidth > 599 && window.innerWidth < 960:
        return 'sm';
      case window.innerWidth > 959 && window.innerWidth < 1280:
        return 'md';
      case window.innerWidth > 1279 && window.innerWidth < 1920:
        return 'lg';
      case window.innerWidth > 1919:
        return 'xl';
    }
  }
}
