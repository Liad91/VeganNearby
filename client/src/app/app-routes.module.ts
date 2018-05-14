import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthSocialComponent } from './core/components/auth/auth-social/auth-social.component';
import { AuthSocialGuard } from './core/components/auth/auth-social/auth-social.guard';
import { HomeComponent } from './core/components/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    data: { name: 'home' }
  },
  {
    path: 'places',
    loadChildren: './places/places.module#PlacesModule',
    data: { name: 'places' }
  },
  {
    path: 'favorites',
    loadChildren: './favorites/favorites.module#FavoritesModule',
    data: { name: 'favorites' }
  },
  {
    path: 'callback',
    component: AuthSocialComponent,
    canActivate: [AuthSocialGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutesModule { }
