import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './core/home/home.component';
import { AuthSocialComponent } from './core/auth/auth-social/auth-social.component';
import { AuthSocialGuard } from './core/auth/auth-social/auth-social.guard';

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
