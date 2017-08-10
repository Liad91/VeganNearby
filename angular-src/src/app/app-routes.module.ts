import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './core/home/home.component';
import { PlacesComponent } from './places/places.component';
import { CanActivateSocialProfile } from './core/nav/profile/social-profile/social-profile.guard';
import { SocialProfileComponent } from './core/nav/profile/social-profile/social-profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full', data: { animation: { page: 'home' } } },
  { path: 'places', component: PlacesComponent, data: { animation: { page: 'places' } } },
  { path: 'callback', component: SocialProfileComponent, canActivate: [CanActivateSocialProfile] }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutesModule { }
