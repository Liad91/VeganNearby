
import { trigger, transition } from '@angular/animations';

import { slideIn, slideOut } from '../../shared/animations';

export const sidebarStateTrigger = trigger('sidebarState', [
  transition('void => open', slideIn('-345px, 0', '200ms ease-out')),
  transition('open => void', slideOut('-345px, 0', '200ms ease-in'))
]);

export const placeStateTrigger = trigger('placeState', [
  transition(':enter', slideIn('-350px, 0', '350ms ease-in-out')),
  transition(':leave', slideOut('350px, 0', '350ms ease-in-out'))
]);
