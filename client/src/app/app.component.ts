import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { routeStateTrigger } from './animations';
import * as authActions from './core/components/auth/store/auth.actions';
import { UtilitiesService } from './core/services/utilities.service';
import { AppState } from './store/app.reducer';

@Component({
  selector: 'vn-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeStateTrigger]
})
export class AppComponent implements OnInit, OnDestroy {
  public routeName: string;
  private routeNameSubscription: Subscription;
  private preloadImages = [
    'assets/images/header.jpg',
    'assets/images/place-banner.jpg',
    'assets/images/favorites-banner.jpg'
  ];

  constructor(private store: Store<AppState>, private utilitiesService: UtilitiesService) { }

  ngOnInit(): void {
    this.authenticate();

    this.routeNameSubscription = this.utilitiesService.navigationEnd
      .pipe(
        map(snapshot => snapshot.data['name'] || 'root')
      )
      .subscribe(name => this.routeName = name);

    this.preloadImages.map(src => {
      new Image().src = src;
    });
  }

  private authenticate() {
    const token = localStorage.getItem('token');

    if (token) {
      this.store.dispatch(new authActions.Authenticate(token));
    }
  }

  ngOnDestroy() {
    this.routeNameSubscription.unsubscribe();
  }
}
