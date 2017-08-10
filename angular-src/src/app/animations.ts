import {
  trigger,
  transition,
  query,
  style,
  animate,
  group
} from '@angular/animations';

export const routeStateTrigger = trigger('routeState', [
  transition('home => places',
    group([
      query(':enter', [
        style({
          transform: 'translateY(-100%)',
          opacity: 0
        }),
        animate('0.5s ease-out')
      ], { optional: true }),
      query(':leave', animate('0.25s', style({
        transform: 'translateY(100%)',
        opacity: 0
      })), { optional: true })
    ])
  )
])
