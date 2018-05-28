import { animate, style, transition, trigger } from '@angular/animations';

export const imgPreviewStateTrigger = trigger('imgPreviewState', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.6)' }),
    animate('250ms ease-out')
  ])
]);
