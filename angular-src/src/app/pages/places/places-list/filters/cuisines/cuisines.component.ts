import { Component, OnInit, ViewChild } from '@angular/core';
import { MzBaseModal, MzModalComponent } from 'ng2-materialize';

import { cuisines } from './../../../data/index';
import { YelpFilter } from './../../../../../models/yelp.model';
import { FiltersService } from './../filters.service';

@Component({
  selector: 'app-cuisines',
  templateUrl: './cuisines.component.html',
  styleUrls: ['./cuisines.component.scss']
})

export class CuisinesComponent extends MzBaseModal implements OnInit {
  @ViewChild('modal')	public modal: MzModalComponent;
  public cuisines: YelpFilter[];
  public displayedCuisines: YelpFilter[];
  public selectedCuisineIndexes: number[] = [];
  public length: number;
  public touched = false;
  public disable = false;

  public modalOptions: Materialize.ModalOptions = {
    dismissible: true,
    opacity: 0.5
  };

  constructor(private filtersService: FiltersService) {
    super();
  }

  ngOnInit(): void {
    this.cuisines = cuisines;
    this.displayedCuisines = this.filtersService.cuisines;

    this.displayedCuisines.forEach(cuisine => {
      if (cuisine.checked) {
        this.selectedCuisineIndexes.push(cuisine.index);
      }
    });

    if (this.selectedCuisineIndexes.length > 0) {
      this.selectedCuisineIndexes.forEach(index => {
        this.cuisines[index].checked = true;
      })
    }

    if (this.selectedCuisineIndexes.length === 5) {
      this.disable = true;
    }
  }

  public onDataChanged(cuisine: YelpFilter, index: number): void {
    this.touched = true;
    cuisine.checked = !cuisine.checked;

    if (cuisine.checked) {
      this.selectedCuisineIndexes.push(index);
      if (this.selectedCuisineIndexes.length === 5) {
        this.disable = true;
      }
    }
    else {
      this.selectedCuisineIndexes.splice(this.selectedCuisineIndexes.indexOf(index), 1);
      if (this.disable) {
        this.disable = false;
      }
    }
  }

  public onApply(): void {
    if (this.touched) {
      const updatedCuisines: YelpFilter[] = [];

      this.selectedCuisineIndexes.forEach(index => {
        updatedCuisines.push(Object.assign(this.cuisines[index], { index }));
      });
      this.filtersService.updateCuisines(updatedCuisines);
    }
    this.onClose();
  }

  public onClose(): void {
    this.modal.close();
  }
}
