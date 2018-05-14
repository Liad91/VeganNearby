import { AuthEffects } from '../core/components/auth/store/auth.effects';
import { HomeEffects } from '../core/components/home/store/home.effects';
import { FavoritesEffects } from '../favorites/store/favorites.effects';

export const effects = [AuthEffects, HomeEffects, FavoritesEffects];
