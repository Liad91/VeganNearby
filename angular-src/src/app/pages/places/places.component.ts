import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ResizeService } from './../../services/resize.service';

@Component({
  selector: 'vn-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit, OnDestroy {
  public mobileView: boolean;
  private resizeSubscription: Subscription;

  constructor(private resizeService: ResizeService) {}

  ngOnInit(): void {
    this.resizeSubscription = this.resizeService.screenSize.subscribe(
      size => {
        this.mobileView = size === 'xs' || size === 'sm';
      }
    );
  }

  ngOnDestroy() {
    this.resizeSubscription.unsubscribe();
  }
}
