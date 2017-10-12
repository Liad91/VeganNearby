import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { PlacesComponent } from './places.component';
import { PlaceListComponent } from './place-list/place-list.component';
import { FavoritesComponent } from './favorites/favorites.component';

// Guards
import { PlaceListGuard } from './place-list/place-list.guard';
import { FavoritesGuard } from './favorites/favorites.guard';

const routes: Routes = [
  {
    path: '',
    component: PlacesComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'list' },
      {
        path: 'list',
        component: PlaceListComponent,
        canActivate: [PlaceListGuard],
        data: { name: 'list' }
      },
      {
        path: 'favorites',
        component: FavoritesComponent,
        canActivate: [FavoritesGuard],
        data: { name: 'favorites' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacesRoutesModule { }
