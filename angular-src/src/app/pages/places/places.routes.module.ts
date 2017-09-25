import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlacesComponent } from './places.component';
import { PlacesListComponent } from './places-list/places-list.component';
import { FavoritesComponent } from './favorites/favorites.component';

import { CanActivatePlacesList } from './places-list/places-list.guard';
import { CanActivateFavorites } from './favorites/favorites.guard';

const routes: Routes = [
  {
    path: '',
    component: PlacesComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'list' },
      { path: 'list', component: PlacesListComponent, canActivate: [CanActivatePlacesList], data: { state: 'list' } },
      { path: 'favorites', component: FavoritesComponent, canActivate: [CanActivateFavorites] , data: { state: 'favorites' }  }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacesRoutesModule { }
