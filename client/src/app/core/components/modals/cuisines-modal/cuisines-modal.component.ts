import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MzBaseModal } from 'ng2-materialize';
import { take } from 'rxjs/operators';

import { SetCuisines, SetOffset } from '../../../../places/components/filters/store/filters.actions';
import { Filter } from './../../../../models/filter.model';
import { GetPlaces } from '../../../../places/components/place-list/store/place-list.actions';
import * as fromPlaces from '../../../../places/store/places.reducer';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'vn-cuisines',
  templateUrl: './cuisines-modal.component.html',
  styleUrls: ['./cuisines-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CuisinesModalComponent extends MzBaseModal implements OnInit {
  public cuisines: Filter[];
  public displayedCuisinesIndexes: number[];
  private selectedCuisines: string[] = [];
  public searchValue = '';
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
        this.selectedCuisines.push(this.cuisines[index].alias);
      }
    });

    if (this.selectedCuisines.length === 5) {
      this.disable = true;
    }
  }

  public trackByAlias(_, cuisine: Filter): string {
    return cuisine.alias;
  }

  public onDataChanged(cuisine: Filter): void {
    this.touched = true;
    cuisine.checked = !cuisine.checked;

    if (cuisine.checked) {
      this.selectedCuisines.push(cuisine.alias);
      if (this.selectedCuisines.length === 5) {
        this.disable = true;
      }
    }
    else {
      this.selectedCuisines.splice(this.selectedCuisines.indexOf(cuisine.alias), 1);
      if (this.disable) {
        this.disable = false;
      }
    }
  }

  public onApply(): void {
    if (this.touched) {
      this.store.dispatch(new SetCuisines(this.selectedCuisines));
      this.store.dispatch(new SetOffset(null));
      this.store.dispatch(new GetPlaces());
    }
    this.modalService.close();
  }

  public onCancel(): void {
    this.modalService.close();
  }
}
