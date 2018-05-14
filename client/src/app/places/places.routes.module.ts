import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guards
import { PlaceDetailGuard } from './components/place-detail/place-detail.guard';

// Components
import { PlacesComponent } from './places.component';
import { PlaceDetailComponent } from './components/place-detail/place-detail.component';
import { PlaceListComponent } from './components/place-list/place-list.component';

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
