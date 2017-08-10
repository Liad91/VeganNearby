import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

export const bgStateTrigger = trigger('bgState', [
  transition(':enter', [
    style({
      opacity: 0.7,
      filter: 'contrast(1.6)'
    }),
    animate('600ms ease-out')
  ]),
  transition(':leave', animate('600ms ease-out', style({
    opacity: 0
  })))
]);
