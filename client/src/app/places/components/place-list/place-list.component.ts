import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, take, withLatestFrom } from 'rxjs/operators';

import { GeographicalService } from '../../../core/services/geographical.service';
import { UtilitiesService } from '../../../core/services/utilities.service';
import { errorStateTrigger } from '../../../shared/animations';
import * as filtersActions from '../filters/store/filters.actions';
import * as fromFilters from '../filters/store/filters.reducer';
import * as fromPlaces from '../../store/places.reducer';
import { placeStateTrigger } from './animations';
import * as placeListActions from './store/place-list.actions';
import { State } from './store/place-list.reducer';

@Component({
  selector: 'vn-place-list',
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.scss'],
  animations: [
    placeStateTrigger,
    errorStateTrigger
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaceListComponent implements OnInit, OnDestroy {
  public state: State;
  private stateSubscription: Subscription;
  public filtersState: fromFilters.State;
  private filtersStateSubscription: Subscription;
  private navigationEndSubscription: Subscription;
  public showFilters = false;
  public currentPage = 1;

  constructor(
    private store: Store<fromPlaces.FeatureState>,
    private router: Router,
    private route: ActivatedRoute,
    private utilitiesService: UtilitiesService,
    private geoService: GeographicalService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.stateSubscription = this.store.select(fromPlaces.selectPlaceList).subscribe(
      state => {
        this.state = state;
        this.changeDetectorRef.markForCheck();
      }
    );

    this.utilitiesService.screenSize.pipe(take(1)).subscribe(screenSize => {
      if (!this.state.view) {
        screenSize === 'xs' ? this.setView('list') : this.setView('grid');
      }
    });

    this.filtersStateSubscription = this.store.select(fromPlaces.selectFilters)
      .subscribe(state => this.filtersState = state);

    this.navigationEndSubscription = this.utilitiesService.navigationEnd
      .filter(snapshot => snapshot.data['name'] && snapshot.data['name'] === 'list')
      .subscribe(snapshot => this.navigationEndHandler(snapshot));
  }

  private navigationEndHandler(snapshot: ActivatedRouteSnapshot) {
    this.store.dispatch(new filtersActions.SetLocation(snapshot.params.city));
    this.queryParamsHandler(Number(snapshot.queryParams['p']), Number(snapshot.queryParams['lat']), Number(snapshot.queryParams['lng']));
    this.validatePageNumber();
  }

  private queryParamsHandler(page: number, lat: number, lng: number): void {
    /** check and validate coordinates */
    if (lat && lng && !isNaN(lat) && !isNaN(lng) && lat < 90 && lat > -90 && lng < 180 && lng > -180) {
      this.store.dispatch(new filtersActions.SetCoordinates({ lat, lng }));
    }
    else {
      this.geoService.geocoder(this.filtersState.location)
        .then(coordinates => {
          this.router.navigate(['places', this.filtersState.location], {
            queryParams: {
              p: 1,
              lat: coordinates.lat,
              lng: coordinates.lng
            }
          });
        })
        .catch(() => this.router.navigate(['/']));
      return;
    }

    /** check and validate page number */
    if (page && !isNaN(page) && (Math.floor(page) - 1) * 18 < 1000) {
      this.currentPage = Math.floor(page);
      this.store.dispatch(new filtersActions.SetOffset(18 * (this.currentPage - 1)));
    }
    else {
      const queryParams = { p: 1, lat: null, lng: null };

      if (this.filtersState.coordinates) {
        queryParams.lat = this.filtersState.coordinates.lat;
        queryParams.lng = this.filtersState.coordinates.lng;
      }

      this.router.navigate(['places', this.filtersState.location], { queryParams });
      return;
    }

    /** get places */
    this.store.dispatch(new placeListActions.GetPlaces());
  }

  private validatePageNumber(): void {
    if (this.state.total && this.state.total < (this.currentPage - 1) * 18) {
      this.router.navigate(['places', this.filtersState.location], {
        queryParams: {
          p: 1,
          lat: this.route.snapshot.params['lat'],
          lng: this.route.snapshot.params['lng']
        }
      });
    }
  }

  public setView(view: 'grid' | 'list'): void {
    this.store.dispatch(new placeListActions.SetView(view));
  }

  public onReload(): void {
    this.store.dispatch(new placeListActions.GetPlaces());
  }

  public trackById(_, place): void {
    return place.id;
  }

  public onPageChange(page: number): void {
    this.utilitiesService.navigate(['places', this.filtersState.location], {
      queryParams: {
        p: page,
        ...this.filtersState.coordinates
      }
    }, {
        scroll: 'smooth'
      });
  }

  public onResetFilters(): void {
    this.store.dispatch(new filtersActions.ResetFilters());
    this.store.dispatch(new placeListActions.GetPlaces());
  }

  ngOnDestroy(): void {
    this.stateSubscription.unsubscribe();
    this.filtersStateSubscription.unsubscribe();
    this.navigationEndSubscription.unsubscribe();
  }
}
