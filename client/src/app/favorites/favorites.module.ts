import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { FavoritesComponent } from './favorites.component';

// Guards
import { FavoritesGuard } from './favorites.guard';

// Modules
import { FavoritesRoutesModule } from './favorites.routes.module';
import { SharedModule } from './../shared/shared.module';

@NgModule({
  declarations: [
    FavoritesComponent
  ],
  imports: [
    CommonModule,
    FavoritesRoutesModule,
    SharedModule
  ],
  providers: [
    FavoritesGuard
  ]
})
export class FavoritesModule {}
