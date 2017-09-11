import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlacesComponent } from './places.component';
import { PlacesListComponent } from './places-list/places-list.component';
import { CanActivatePlaces } from './places.guard';

const routes: Routes = [
  {
    path: '',
    component: PlacesComponent,
    canActivate: [CanActivatePlaces],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'list' },
      { path: 'list', component: PlacesListComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacesRoutesModule { }
