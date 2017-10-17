import { Component, OnInit, ViewChild } from '@angular/core';
import { MzBaseModal, MzModalComponent } from 'ng2-materialize';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/take';

import * as fromPlaces from '../../store/places.reducers';
import { Filter } from '../store/filters.reducers';
import { SetCuisines, SetOffset } from '../store/filters.actions';
import { GetPlaces, SetCurrentPage } from '../../place-list/store/place-list.actions';

@Component({
  selector: 'vn-cuisines',
  templateUrl: './cuisines-modal.component.html',
  styleUrls: ['./cuisines-modal.component.scss']
})

export class CuisinesModalComponent extends MzBaseModal implements OnInit {
  @ViewChild('modal')	public modal: MzModalComponent;
  public cuisines: Filter[];
  public displayedCuisinesIndexes: number[];
  private selectedCuisineIndexes: number[] = [];
  public cuisineIndexes: number[];
  public touched = false;
  public disable = false;

  public modalOptions: Materialize.ModalOptions = {
    dismissible: false,
    endingTop: '0',
    opacity: 0.5,
  };

  constructor(private store: Store<fromPlaces.FeatureState>) {
    super();
  }

  ngOnInit(): void {
    this.store.select(fromPlaces.selectFiltersCuisines).take(1).subscribe(cuisines => this.cuisines = cuisines);
    this.store.select(fromPlaces.selectFiltersDisplayedCuisines).take(1).subscribe(indexes => this.displayedCuisinesIndexes = indexes);

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
      this.store.dispatch(new SetCuisines (this.cuisineIndexes));
      this.store.dispatch(new SetOffset(null));
      this.store.dispatch(new SetCurrentPage(1));
      this.store.dispatch(new GetPlaces());
    }
    this.modal.close();
  }

  public onCancel(): void {
    this.modal.close();
    if (this.touched) {
      this.cuisines.forEach((cuisine, index) => {
        if (this.selectedCuisineIndexes.indexOf(index) > -1) {
          cuisine.checked = true;
        }
        else {
          cuisine.checked = false;
        }
      });
    }
  }
}
