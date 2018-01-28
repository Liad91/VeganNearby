import { Component, OnInit } from '@angular/core';
import { MzBaseModal } from 'ng2-materialize';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import * as fromPlaces from '../../../places/store/places.reducer';
import { Filter } from '../../../places/filters/store/filters.reducer';
import { SetCuisines, SetOffset } from '../../../places/filters/store/filters.actions';
import { GetPlaces } from '../../../places/place-list/store/place-list.actions';
import { ModalService } from './../../../core/services/modal.service';

@Component({
  selector: 'vn-cuisines',
  templateUrl: './cuisines-modal.component.html',
  styleUrls: ['./cuisines-modal.component.scss']
})

export class CuisinesModalComponent extends MzBaseModal implements OnInit {
  public cuisines: Filter[];
  public displayedCuisinesIndexes: number[];
  private selectedCuisineIndexes: number[] = [];
  public cuisineIndexes: number[];
  public touched = false;
  public disable = false;

  public modalOptions: Materialize.ModalOptions = {
    dismissible: true,
    opacity: 0.5,
  };

  constructor(private store: Store<fromPlaces.FeatureState>, private modalService: ModalService) {
    super();
  }

  ngOnInit(): void {
    this.store.select(fromPlaces.selectFiltersCuisines)
      .pipe(
        take(1)
      )
      .subscribe(cuisines => this.cuisines = cuisines.map(cuisine => {
        return {
          ...cuisine
        };
      }));

    this.store.select(fromPlaces.selectFiltersDisplayedCuisines)
      .pipe(
        take(1)
      )
      .subscribe(indexes => this.displayedCuisinesIndexes = indexes);

    this.displayedCuisinesIndexes.forEach(index => {
      if (this.cuisines[index].checked) {
        this.selectedCuisineIndexes.push(index);
      }
    });

    this.cuisineIndexes = this.selectedCuisineIndexes.slice();

    if (this.cuisineIndexes.length === 5) {
      this.disable = true;
    }
  }

  public onDataChanged(cuisine: Filter, index: number): void {
    this.touched = true;
    cuisine.checked = !cuisine.checked;

    if (cuisine.checked) {
      this.cuisineIndexes.push(index);
      if (this.cuisineIndexes.length === 5) {
        this.disable = true;
      }
    }
    else {
      this.cuisineIndexes.splice(this.cuisineIndexes.indexOf(index), 1);
      if (this.disable) {
        this.disable = false;
      }
    }
  }

  public onApply(): void {
    if (this.touched) {
      this.store.dispatch(new SetCuisines(this.cuisineIndexes));
      this.store.dispatch(new SetOffset(null));
      this.store.dispatch(new GetPlaces());
    }
    this.modalService.close();
  }

  public onCancel(): void {
    this.modalService.close();
  }
}
