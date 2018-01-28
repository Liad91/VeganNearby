import { trigger, transition } from '@angular/animations';

import { zoomOut, slideIn } from '../shared/animations';

export const placeStateTrigger = trigger('placeState', [
  transition(':enter', slideIn('0, -50px', '250ms')),
  transition(':leave', zoomOut('0', '150ms ease-out'))
]);
