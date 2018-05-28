import { trigger, transition, style, animate } from '@angular/animations';

export const placeStateTrigger = trigger('placeState', [
  transition(':enter', [
    style({ transform: 'scale(0.6)', opacity: '0' }),
    animate(250)
  ]),
  transition(':leave', [
    animate(250, style({ transform: 'scale(0)', opacity: '0' }))
  ])
]);
