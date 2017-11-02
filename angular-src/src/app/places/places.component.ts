import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { UtilitiesService } from './../core/services/utilities.service';
import { routeStateTrigger } from './animations';

@Component({
  selector: 'vn-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss'],
  animations: [ routeStateTrigger ]
})
export class PlacesComponent implements OnInit, OnDestroy {
  public mobileView: boolean;
  private resizeSubscription: Subscription;

  constructor(private utilitiesService: UtilitiesService) {}

  ngOnInit(): void {
    this.resizeSubscription = this.utilitiesService.screenSize.subscribe(
      size => {
        this.mobileView = size === 'xs' || size === 'sm';
      }
    );
  }

  public getAnimationState(outlet: RouterOutlet): string {
    return outlet.activatedRouteData['state'] || 'root';
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }
}
