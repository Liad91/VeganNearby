import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  NavigationExtras,
  Router
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/filter';

@Injectable()
export class UtilitiesService {
  public screenSize = new BehaviorSubject<string>(this.getScreenSize());
  public navigationEnd = new BehaviorSubject<ActivatedRouteSnapshot>(this.activatedRoute.snapshot);
  public navigationData = new BehaviorSubject<any>({});

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.screenResizeSubscriber();
    this.navigationEndSubscriber();
  }

  public navigate(commands: any[], extras: NavigationExtras = {}, data: any = {}) {
    this.navigationData.next(data);
    this.router.navigate(commands, extras);
  }

  private screenResizeSubscriber(): void {
    Observable.fromEvent(window, 'resize')
      .map(this.getScreenSize)
      .subscribe(this.screenSize);
  }

  private navigationEndSubscriber(): void {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .mapTo(this.activatedRoute)
      .map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
      .map(route => route.snapshot)
      .do(() => this.scrollToTop())
      .subscribe(this.navigationEnd);
  }

  private scrollToTop(): void {
    if (this.navigationData.getValue()['scroll']) {
      window.scrollTo(0, 0);
    }
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
