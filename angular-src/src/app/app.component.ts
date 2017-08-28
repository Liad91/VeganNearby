import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './services/auth.service';
import { routeStateTrigger } from './animations';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	animations: [ routeStateTrigger ]
})
export class AppComponent implements OnInit {

	constructor(private authService: AuthService) {}

	ngOnInit(): void {
		this.authService.authenticate();
	}

	getAnimation(routerOutlet: RouterOutlet) {
		const routeData = routerOutlet.activatedRouteData['animation'];

		if (!routeData) {
			return 'root';
		}
		return routeData.page;
	}
}
