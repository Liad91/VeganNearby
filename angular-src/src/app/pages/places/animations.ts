import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

import { slideIn, slideOut } from '../../shared/animations';

export const sidebarStateTrigger = trigger('sidebarState', [
  transition(':enter', slideIn('-345px, 0', '200ms ease-out')),
  transition(':leave', slideOut('-345px, 0', '150ms ease-in'))
]);
