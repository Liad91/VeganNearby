import { trigger, transition, style, animate } from '@angular/animations';

export const placeStateTrigger = trigger('placeState', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-50px)' }),
    animate(250)
  ])
]);
