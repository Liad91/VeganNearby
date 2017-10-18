import { trigger, transition } from '@angular/animations';

import { slideIn, zoomOut } from '../../shared/animations';

export const placeStateTrigger = trigger('placeState', [
  transition(':enter', slideIn('0, -40px', '200ms ease-out')),
  transition(':leave', zoomOut('0', '150ms ease-out'))
]);
