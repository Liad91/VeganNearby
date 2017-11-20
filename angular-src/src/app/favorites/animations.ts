import { trigger, transition } from '@angular/animations';

import { zoomOut } from '../shared/animations';

export const placeStateTrigger = trigger('placeState', [
  transition(':leave', zoomOut('0', '150ms ease-out'))
]);
