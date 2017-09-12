import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './services/auth.service';
import { routeStateTrigger } from './animations';

@Component({
  selector: 'vn-root',
  templateUrl: './app.component.html',
  animations: [ routeStateTrigger ]
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.authenticate();
  }

  getAnimation(outlet: RouterOutlet) {
    return outlet.activatedRouteData.state;
  }
}
