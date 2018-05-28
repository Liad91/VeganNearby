import { animate, style, transition, trigger } from '@angular/animations';

export const errorStateTrigger = trigger('errorState', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.5)' }),
    animate('250ms ease-out')
  ])
]);
