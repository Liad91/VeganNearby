import { Component, OnInit, ViewChild } from '@angular/core';
import { MzBaseModal, MzModalComponent } from 'ng2-materialize';

import { cuisines } from './../../data/index';
import { YelpFilter } from './../../../../models/yelp.model';
import { FiltersService } from './../filters.service';

@Component({
  selector: 'app-cuisines',
  templateUrl: './cuisines.component.html',
  styleUrls: ['./cuisines.component.scss']
})

export class CuisinesComponent extends MzBaseModal implements OnInit {
  @ViewChild('modal')	public modal: MzModalComponent;
  public cuisines: YelpFilter[];
  public selectedCuisines: string[];
  public selectedChanged = false;

  public modalOptions: Materialize.ModalOptions = {
    dismissible: true,
    opacity: 0.5
  };

  constructor(private filtersService: FiltersService) {
    super();
  }

  ngOnInit(): void {
    this.cuisines = cuisines;
    this.selectedCuisines = this.filtersService.selectedCuisines.slice();
  }

  public onDataChanged(cuisine: string): void {
    const index = this.selectedCuisines.indexOf(cuisine);

    this.selectedChanged = true;
    if (index < 0) {
      this.selectedCuisines.push(cuisine);
    }
    else {
      this.selectedCuisines.splice(index, 1);
    }
  }

  onApply(): void {
    if (this.selectedChanged) {
      const updatedCuisines: YelpFilter[] = [];

      this.selectedCuisines.forEach(cuisine => {
        const index = this.cuisines.findIndex(value => value.alias === cuisine);

        updatedCuisines.push(cuisines[index]);
      });
      this.filtersService.updateCuisines(updatedCuisines);
    }
    this.onClose();
  }

  onClose(): void {
    this.modal.close();
  }
}
