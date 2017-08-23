import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlacesComponent } from './places.component';
import { CanActivatePlaces } from './places.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PlacesComponent,
    canActivate: [CanActivatePlaces],
    data: { animation: { page: 'places' } }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacesRoutesModule { }
