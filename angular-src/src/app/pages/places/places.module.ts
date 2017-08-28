import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

import { PlacesComponent } from './places.component';
import { FiltersComponent } from './filters/filters.component';
import { CuisinesComponent } from './filters/cuisines/cuisines.component';
import { PlacesRoutesModule } from './places.routes.module';
import { ComponentsModule } from '../../components/components.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
	declarations: [
		PlacesComponent,
		FiltersComponent,
		CuisinesComponent
	],
	entryComponents: [
		CuisinesComponent
	],
	imports: [
		FormsModule,
		CommonModule,
		AgmCoreModule,
		PlacesRoutesModule,
		ComponentsModule,
		SharedModule
	]
})
export class PlacesModule { }
