import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { placeStateTrigger } from './animations';
import { State } from './store/favorites.reducers';
import * as fromRoot from '../../store/app.reducers';
import { GetFavorites } from './store/favorites.actions';
import { YelpBusiness } from './../../models/yelp.model';

@Component({
  selector: 'vn-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  animations: [placeStateTrigger]
})

export class FavoritesComponent implements OnInit {
  public state: Observable<State>

  constructor(private store: Store<fromRoot.AppState>) {}

  ngOnInit(): void {
    this.state = this.store.select(fromRoot.selectFavorites);
  }

  public onReload(): void {
    this.store.next(new GetFavorites());
  }
}
