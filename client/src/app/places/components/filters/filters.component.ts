import { AgmMap, GoogleMapsAPIWrapper, LatLngBounds } from '@agm/core';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as noUiSlider from 'materialize-css/extras/noUiSlider/nouislider.min.js';

import { GeographicalService } from '../../../core/services/geographical.service';
import { UtilitiesService } from '../../../core/services/utilities.service';
import { YelpBusiness } from '../../../models/yelp.model';
import mapStyles from '../../data/map-styles';
import { GetPlaces } from '../place-list/store/place-list.actions';
import * as fromPlaces from '../../store/places.reducer';
import { SetSearchCategory } from './../../../core/components/search/store/search.actions';
import { ModalService } from './../../../core/services/modal.service';
import { CuisinesModalComponent } from './../../../core/components/modals/cuisines-modal/cuisines-modal.component';
import { Filter } from './../../../models/filter.model';
import * as filtersActions from './store/filters.actions';
import { State } from './store/filters.reducer';

@Component({
  selector: 'vn-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersComponent implements OnInit, OnDestroy {
  @ViewChild(AgmMap) map: any;
  @ViewChild('slider') slider: ElementRef;
  @Input() places: YelpBusiness[];
  public state: State;
  public updateOnDrag = true;
  public mapStyles = mapStyles;
  public mapBounds: LatLngBounds;
  private stateSubscription: Subscription;
  private dragEndSubscription: Subscription;

  constructor(
    private store: Store<fromPlaces.FeatureState>,
    private modalService: ModalService,
    private geoService: GeographicalService,
    private utilitiesService: UtilitiesService) { }

  ngOnInit(): void {
    this.stateSubscription = this.store.select(fromPlaces.selectFilters).subscribe(state => this.state = state);

    // TODO: Use (dragEnd) after https://github.com/SebastianM/angular-google-maps/pull/1159 will merged
    this.dragEndSubscription = (<GoogleMapsAPIWrapper>this.map._mapsWrapper)
      .subscribeToMapEvent('dragend')
      .subscribe(() => this.onDragEnd());

    this.initilaizeNoUiSlider();
  }

  private initilaizeNoUiSlider(): void {
    noUiSlider.create(this.slider.nativeElement, {
      start: this.state.radius / 1000,
      connect: [true, false],
      range: {
        'min': 1,
        'max': 40
      }
    });
    this.slider.nativeElement.noUiSlider.on('change', val => this.onRadiusChanged(val));
  }

  private onDragEnd(): void {
    if (this.updateOnDrag) {
      this.store.dispatch(new filtersActions.SetCoordinates({ lat: this.map.latitude, lng: this.map.longitude }));

      this.geoService.geocoder(this.state.coordinates)
        .then(location => this.geocoderSuccess(location))
        .catch(() => this.dispatchActions());
    }
  }

  private geocoderSuccess(location: string): void {
    this.store.dispatch(new filtersActions.SetLocation(location));
    this.dispatchActions();
  }

  public onRadiusChanged(values: number[]): void {
    this.store.dispatch(new filtersActions.SetRadius(values[0] * 1000));
    this.dispatchActions();
  }

  public onZoomChanged(zoom: number): void {
    this.store.dispatch(new filtersActions.SetZoom(zoom));
  }

  public onReset(): void {
    this.store.dispatch(new filtersActions.ResetFilters());
    this.dispatchActions();
  }

  public onCategoryChanged(category: Filter, index: number): void {
    this.store.dispatch(new filtersActions.SetCategory(category));
    this.store.dispatch(new SetSearchCategory(index));
    this.dispatchActions();
  }

  public updatePrices(price: Filter): void {
    this.store.dispatch(new filtersActions.UpdatePrices(price));
    this.dispatchActions();
  }

  public updateCuisines(cuisine: Filter): void {
    this.store.dispatch(new filtersActions.UpdateCuisines(cuisine));
    this.dispatchActions();
  }

  private dispatchActions() {
    const queryParams = this.utilitiesService.navigationEnd.getValue().queryParams;

    if (Number(queryParams.p) === 1 &&
      Number(queryParams.lat) === this.state.coordinates.lat &&
      Number(queryParams.lng) === this.state.coordinates.lng) {
      this.store.dispatch(new GetPlaces());
    }
    else {
      this.utilitiesService.navigate(['places', this.state.location], {
        queryParams: {
          p: 1,
          ...this.state.coordinates
        }
      });
    }
  }

  public openModal(): void {
    this.modalService.open(CuisinesModalComponent);
  }

  ngOnDestroy(): void {
    this.stateSubscription.unsubscribe();
    this.dragEndSubscription.unsubscribe();
    this.slider.nativeElement.noUiSlider.destroy();

    // Fix DOM nodes leak
    // Add delay for animation
    // https://github.com/SebastianM/angular-google-maps/issues/1207
    setTimeout(() => $(this.map._elem.nativeElement).remove(), 500);
  }
}
