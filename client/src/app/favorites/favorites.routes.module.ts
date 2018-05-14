import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { FavoritesComponent } from './favorites.component';

// Guards
import { FavoritesGuard } from './favorites.guard';

const routes: Routes = [
  { path: '', component: FavoritesComponent, canActivate: [FavoritesGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FavoritesRoutesModule { }
