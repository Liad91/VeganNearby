import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './core/home/home.component';
import { SocialCallbackComponent } from './core/nav/registration/social-callback/social-callback.component';
import { CanActivateSocialCallback } from './core/nav/registration/social-callback/social-callback.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'callback', component: SocialCallbackComponent, canActivate: [CanActivateSocialCallback] }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutesModule { }
