import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { CanActivateSocialProfile } from './components/profile/social-profile/social-profile.guard';
import { SocialProfileComponent } from './components/profile/social-profile/social-profile.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		pathMatch: 'full',
		data: { animation: { page: 'home' } }
	},
	{
		path: 'places',
		loadChildren: './pages/places/places.module#PlacesModule'
	},
	{
		path: 'callback',
		component: SocialProfileComponent,
		canActivate: [CanActivateSocialProfile]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutesModule { }
