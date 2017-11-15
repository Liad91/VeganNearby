import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UtilitiesService } from './../core/services/utilities.service';
import { routeStateTrigger } from './animations';

@Component({
  selector: 'vn-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss'],
  animations: [ routeStateTrigger ]
})
export class PlacesComponent implements OnInit {
  public routeName: Observable<string>;

  constructor(private utilitiesService: UtilitiesService) {}

  ngOnInit(): void {
    this.routeName = this.utilitiesService.navigationEnd.map(snapshot => snapshot.data['name'] || 'root');
  }
}
