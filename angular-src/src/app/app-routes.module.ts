import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { CanActivateSocialProfile } from './components/profile/social-profile/social-profile.guard';
import { SocialProfileComponent } from './components/profile/social-profile/social-profile.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    data: { state: 'home' }
  },
  {
    path: 'places',
    loadChildren: './pages/places/places.module#PlacesModule',
    data: { state: 'places' }
  },
  {
    path: 'callback',
    component: SocialProfileComponent,
    canActivate: [CanActivateSocialProfile]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutesModule { }
