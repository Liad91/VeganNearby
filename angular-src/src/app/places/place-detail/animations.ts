
import { transition, trigger } from '@angular/animations';

import { slideIn, zoomIn, zoomOut } from '../../shared/animations';

export const placeStateTrigger = trigger('placeState', [
  transition(':enter', slideIn('0, -50px', '250ms'))
]);
