
import { animate, transition, trigger, style } from '@angular/animations';

import { slideIn, slideOut } from '../../shared/animations';

export const placeStateTrigger = trigger('placeState', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateX(-350px) scale(0.7)'
    }),
    animate('350ms ease-in-out')
  ]),
  transition(':leave', animate('350ms ease-in-out',
    style({
      opacity: 0,
      transform: 'translateX(350px) scale(0.7)'
    })
  ))
]);
