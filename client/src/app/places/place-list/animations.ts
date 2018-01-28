
import { animate, transition, trigger, style } from '@angular/animations';

import { slideIn, slideOut } from '../../shared/animations';

export const placeStateTrigger = trigger('placeState', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateX(-100%)'
    }),
    animate('350ms ease-out')
  ]),
  transition(':leave', [
    animate('350ms ease-out', style({
      opacity: 0,
      transform: 'translateX(100%)'
    }))
  ])
]);
