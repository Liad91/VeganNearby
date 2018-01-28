import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { PlacesComponent } from './places.component';
import { PlaceListComponent } from './place-list/place-list.component';
import { PlaceDetailComponent } from './place-detail/place-detail.component';

// Guards
import { PlaceDetailGuard } from './place-detail/place-detail.guard';

const routes: Routes = [
  {
    path: '',
    component: PlacesComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/' },
      {
        path: ':city',
        component: PlaceListComponent,
        data: { name: 'list' }
      },
      {
        path: 'place/:id',
        component: PlaceDetailComponent,
        canActivate: [PlaceDetailGuard],
        data: { name: 'place' }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacesRoutesModule { }
