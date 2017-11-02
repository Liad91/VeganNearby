import { HomeEffects } from '../core/home/store/home.effects';
import { AuthEffects } from '../core/auth/store/auth.effects';
import { FavoritesEffects } from '../favorites/store/favorites.effects';

export const effects = [ AuthEffects, HomeEffects, FavoritesEffects ];
