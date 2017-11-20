import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UtilitiesService } from './../core/services/utilities.service';

@Component({
  selector: 'vn-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {
  constructor(private utilitiesService: UtilitiesService) {}

  ngOnInit(): void {
  }
}
